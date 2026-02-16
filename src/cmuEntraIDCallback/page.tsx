import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
// FIX 1: Use React Router hooks instead of Next.js
<<<<<<< HEAD
import { useNavigate, useSearchParams } from "react-router-dom"; 
=======
import { useNavigate, useSearchParams } from "react-router-dom";
>>>>>>> 53e280fb4f7ac4e31476885a6e9c591796fbaa08
import type { SignInResponse } from "../app/api/signIn/route";

export default function CmuEntraIDCallback() {
  // FIX 2: useSearchParams returns an array in React Router
  const [searchParams] = useSearchParams();
<<<<<<< HEAD
  const navigate = useNavigate(); 
  
  const code = searchParams.get('code');
=======
  const navigate = useNavigate();

  const code = searchParams.get("code");
>>>>>>> 53e280fb4f7ac4e31476885a6e9c591796fbaa08
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!code) return;

<<<<<<< HEAD
    console.log("Authorization Code:", code);

    axios
      .post<SignInResponse>("http://localhost:3000/auth/signIn", { authorizationCode: code },{ withCredentials: true }) 
      .then((resp) => {
        if (resp.data.ok) {
          // FIX 3: Use navigate() instead of router.push()
          navigate("/me"); 
=======
    // console.log("Authorization Code:", code);

    axios
      .post<SignInResponse>(
        "http://localhost:3000/auth/signIn",
        { authorizationCode: code },
        { withCredentials: true }
      )
      .then((resp) => {
        if (resp.data.ok) {
          // FIX 3: Use navigate() instead of router.push()
          navigate("/dashboard");
>>>>>>> 53e280fb4f7ac4e31476885a6e9c591796fbaa08
        } else {
          setMessage(resp.data.message || "Login failed");
        }
      })
      .catch((error: AxiosError<SignInResponse>) => {
        // ... error handling is the same ...
        if (!error.response) {
          setMessage("Cannot connect to server (Is your Backend running?)");
        } else if (!error.response.data.ok) {
<<<<<<< HEAD
          setMessage("Login failed: " + (error.response.data.message || "Unknown error"));
=======
          setMessage(
            "Login failed: " + (error.response.data.message || "Unknown error")
          );
>>>>>>> 53e280fb4f7ac4e31476885a6e9c591796fbaa08
        } else {
          setMessage("Unknown error occurred");
        }
      });
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-600">
      {message || "Authenticating with CMU..."}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 53e280fb4f7ac4e31476885a6e9c591796fbaa08
