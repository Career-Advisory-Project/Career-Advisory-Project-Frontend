import axios from "axios";
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
// Go up 3 levels to reach 'src', then into 'types'
import type { CmuEntraIDBasicInfo } from "../../../types/CmuEntraIDBasicInfo";

type SuccessResponse = {
  ok: true;
};

type ErrorResponse = {
  ok: false;
  message: string;
};

export type SignInResponse = SuccessResponse | ErrorResponse;

// Get EntraID Access Token
async function getEmtraIDAccessTokenAsync(authorizationCode: string): Promise<string | null> {
  try {
    const tokenUrl = process.env.CMU_ENTRAID_GET_TOKEN_URL;
    const redirectUrl = process.env.CMU_ENTRAID_REDIRECT_URL;
    const clientId = process.env.CMU_ENTRAID_CLIENT_ID;
    const clientSecret = process.env.CMU_ENTRAID_CLIENT_SECRET;
    const scope = process.env.SCOPE;

    if (!tokenUrl || !redirectUrl || !clientId || !clientSecret) {
      console.error("Missing Environment Variables for CMU EntraID");
      return null;
    }

    // FIX 2: Use URLSearchParams to properly format data as x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('code', authorizationCode);
    params.append('redirect_uri', redirectUrl);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', scope || "");
    params.append('grant_type', 'authorization_code');

    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;    
  } catch (error: any) {
    // Log error to terminal so you can see why it failed
    console.error("Get Token Error:", error.response?.data || error.message);
    return null;
  }
}

// Get Basic Info
async function getCMUBasicInfoAsync(accessToken: string) {
  try {
    const basicInfoUrl = process.env.CMU_ENTRAID_GET_BASIC_INFO;
    if (!basicInfoUrl) return null;

    const response = await axios.get(basicInfoUrl, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    return response.data as CmuEntraIDBasicInfo;
  } catch (error: any) {
    console.error("Get Basic Info Error:", error.response?.data || error.message);
    return null;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<SignInResponse>> {
  try {
    const body = await req.json();
    const { authorizationCode } = body;
    
    if (!authorizationCode || typeof authorizationCode !== "string") {
      return NextResponse.json({ ok: false, message: "Invalid authorization code" }, { status: 400 });    
    }
    
    // 1. Get access token
    const accessToken = await getEmtraIDAccessTokenAsync(authorizationCode);
    if (!accessToken) {
       return NextResponse.json({ ok: false, message: "Cannot get EntraID access token" }, { status: 400 });    
    }

    // 2. Get basic info
    const cmuBasicInfo = await getCMUBasicInfoAsync(accessToken);
    if (!cmuBasicInfo) {
      return NextResponse.json({ ok: false, message: "Cannot get CMU basic info" }, { status: 400 });   
    }

    // 3. Create Session Token (JWT)
    if (typeof process.env.JWT_SECRET !== "string") {
      console.error("JWT_SECRET is missing in .env");
      return NextResponse.json({ ok: false, message: "Server configuration error" }, { status: 500 });
    }

    const token = jwt.sign(
      {
        cmuitaccount_name: cmuBasicInfo.cmuitaccount_name,
        cmuitaccount: cmuBasicInfo.cmuitaccount,
        student_id: cmuBasicInfo.student_id,
        // Add other fields you need here
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    // 4. Set Cookie
    const cookieStore = await cookies(); // Ensure 'await' if using Next.js 15+
    
    cookieStore.set({
      name: "cmu-entraid-example-token",
      value: token,
      maxAge: 3600,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // FIX 3: Remove 'domain: "localhost"' -> it often breaks cookies in local dev
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Unexpected Error:", err);
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
  }
}