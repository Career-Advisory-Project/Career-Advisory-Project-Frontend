'use client'
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define types locally to avoid import errors
type CmuBasicInfo = {
  cmuitaccount_name: string;
  cmuitaccount: string;
  student_id?: string;
  prename_id?: string;
  prename_TH?: string;
  prename_EN?: string;
  firstname_TH: string;
  firstname_EN: string;
  lastname_TH: string;
  lastname_EN: string;
  organization_code: string;
  organization_name_TH: string;
  organization_name_EN: string;
  itaccounttype_id: string;
  itaccounttype_TH: string;
  itaccounttype_EN: string;
};

type WhoAmIResponse = {
  ok: boolean;
  user?: CmuBasicInfo;
};

export default function MePage() {
  // const router = useRouter();
  const navigate = useNavigate();
  // Changed to hold a SINGLE object, not an array
  const [cmuBasicInfo, setCmuBasicInfo] = useState<CmuBasicInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  function signOut() {
    // FIX 2: Use absolute path
    axios.post("http://localhost:3000/auth/me").then((response) => {   
      if (response.data.ok) {
         // FIX 3: Environment variables on client must start with NEXT_PUBLIC_
         // Or you can hardcode the URL if the env var isn't working
         const logoutUrl = process.env.NEXT_PUBLIC_CMU_ENTRAID_LOGOUT_URL || "/";
        //  router.push(logoutUrl); 
          navigate(logoutUrl);
      } else {
        //  router.push('/');  
        navigate('/');
      }   
    }).catch(() => {
      // router.push('/');
      navigate('/');
    });
  }

  useEffect(() => {
    // FIX 1: Use absolute path '/api/whoAmI' instead of relative '../'
    axios
      .get<WhoAmIResponse>("http://localhost:3000/auth/me", { 
      withCredentials: true // <--- ADD THIS
    }) 
      .then((response) => {
        if (response.data.ok && response.data.user) {
          setCmuBasicInfo(response.data.user);
           // ดักจับ Student / Alumni 
          // const user = response.data.user;
          // const userType = (user.itaccounttype_EN || "").toLowerCase();
          // if (userType.includes("student") || userType.includes("alumni")) {
          //    // 1. แจ้งเตือน
          //    alert("⛔ Access Denied: This system is for Instructors only.");
          //    // 2. สั่ง Logout 
          //    signOut();
          //    return; 
          // }
          //  ถ้าไม่ใช่ Student ค่อยเอาข้อมูลใส่ State เพื่อแสดงผล
          // setCmuBasicInfo(user);
        } else {
            setErrorMessage("Failed to fetch user info");}
      })
      .catch((error: AxiosError<WhoAmIResponse>) => {
        if (!error.response) {
          setErrorMessage("Cannot connect to the network.");
        } else if (error.response.status === 401) {
          setErrorMessage("Authentication failed");
          // Optional: Redirect to login automatically
          // router.push("/"); 
        } else {
          setErrorMessage("An unknown error occurred");}
      });
  }, []); // Empty dependency array = run once on mount

  return (
    <div className="p-10 font-sans text-gray-800">
        <h1 className="text-2xl font-bold mb-4">
          Hi, {cmuBasicInfo ? `${cmuBasicInfo.firstname_EN} ${cmuBasicInfo.lastname_EN}` : "Loading..."}
        </h1>
        
        {errorMessage && (
           <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
             {errorMessage}
           </div>
        )}

        {/* FIX 4: Render the single object directly, removed .map() */}
        {cmuBasicInfo && (
          <div className="bg-white p-6 rounded shadow-md border border-gray-200 space-y-2">
             <h3 className="font-semibold text-lg border-b pb-2 mb-2">Student Info</h3>
             <p><strong>Account Name:</strong> {cmuBasicInfo.cmuitaccount_name}</p>
             <p><strong>Email:</strong> {cmuBasicInfo.cmuitaccount}</p>
             <p><strong>Student ID:</strong> {cmuBasicInfo.student_id || "No Student ID"}</p>
             <p><strong>Organization:</strong> {cmuBasicInfo.organization_name_EN}</p>
             <p><strong>Account Type:</strong> {cmuBasicInfo.itaccounttype_EN}</p>
          </div>
        )}

        <button 
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition" 
          onClick={signOut}
        >
          {errorMessage ? "Go back" : "Sign out"}
        </button>
    </div>
  );
}