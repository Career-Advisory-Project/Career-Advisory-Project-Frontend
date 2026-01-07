import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const CmuentraidURL = (import.meta.env.VITE_CMU_ENTRAID_URL as string) || "#";
  const handleLogin = () => {
      // console.log("CMU Entra ID URL:", CmuentraidURL);
      navigate(CmuentraidURL);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#A69FB8]">
      
      <div className="w-[818px] h-[591px] bg-white rounded-lg shadow-[0px_4px_4px_0px_#00000040] px-[50px] py-[50px] flex flex-col gap-[15px] items-center ">
        
        <img 
          src="src/assets/images/logo1.svg" 
          alt="logo Icon" 
          className="w-[251px] h-[250px] object-contain" 
        />
        
        <h1 className="w-[608px] h-[63px] font-['CMU'] font-bold italic text-[48px] leading-none text-center text-[#5E4481]">
          Career Advisory
        </h1>

        {/* FIX: Use a standard <a> tag for external navigation */}
          <button onClick={handleLogin} className="w-[508px] h-[79px] bg-[#5E4481] rounded-lg flex items-center justify-center font-['CMU'] font-semibold text-[24px] text-white hover:opacity-90 transition-opacity duration-200">
            Login with CMU account
          </button>

        <a 
          href="https://skillsync.cpe.eng.cmu.ac.th/" 
          className="w-[508px] h-[27px] font-['CMU'] font-light italic text-[20px] text-[#64748B] text-right hover:text-[#5E4481] transition-colors duration-200"
        >
          move to website for student &gt;
        </a>
        
      </div>

    </div>
  );
};

export default Login;