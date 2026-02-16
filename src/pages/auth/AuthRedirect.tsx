import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { getMe } from "../../services/auth.service";

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // const me = await getMe();
        /**
         * Expected example:
         * {
         *   id: string;
         *   role: "student" | "instructor";
         * }
         */
        // if (me.role === "student") {
        //   navigate("/dashboard", { replace: true });
        // } else if (me.role === "instructor") {
        //   navigate("/instructor/dashboard", { replace: true });
        // } else {
        //   navigate("/login", { replace: true });
        // }
      } catch (err) {
        // Session invalid or API failed
        // navigate("/login", { replace: true });
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-gray-600">Signing you in...</p>
    </div>
  );
};

export default AuthRedirect;
