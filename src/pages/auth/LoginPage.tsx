const Login = () => {
  return (
    // Container: Full screen height, centered content, background #A69FB8
    <div className="min-h-screen flex items-center justify-center bg-[#A69FB8]">
      {/* Panel: Fixed dimensions, white bg, specific shadow, flex column layout */}
      <div className="w-full max-w-[818px] min-h-[591px] mx-4 bg-white rounded-lg shadow-[0px_4px_4px_0px_#00000040] px-8 sm:px-[50px] py-[50px] flex flex-col gap-[15px] items-center">
        {" "}
        <img
          src="/src/assets/images/logo1.svg"
          alt="logo Icon"
          className="w-[251px] h-[250px] object-contain"
        />
        {/* Title: CMU font, Bold Italic, Deep Purple */}
        <h1 className="w-[608px] h-[63px] font-['CMU'] font-bold italic text-[48px] leading-none text-center text-[#5E4481]">
          Career Advisory
        </h1>
        {/* Button: Purple background, hover effect, white text */}
        <button className="w-[508px] h-[79px] bg-[#5E4481] rounded-lg flex items-center justify-center font-['CMU'] font-semibold text-[24px] text-white hover:opacity-90 transition-opacity duration-200">
          Login with CMU account
        </button>
        <a
          href="https://skillsync.cpe.eng.cmu.ac.th/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[508px] h-[27px] font-['CMU'] font-light italic text-[20px] text-[#64748B] text-right hover:text-[#5E4481] transition-colors duration-200"
        >
          move to website for student →
        </a>{" "}
      </div>
    </div>
  );
};

export default Login;
