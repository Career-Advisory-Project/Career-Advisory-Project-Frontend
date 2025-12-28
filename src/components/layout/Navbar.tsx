const Navbar = ({
  lang,
  onToggleLang,
}: {
  lang: "en" | "th";
  onToggleLang: () => void;
}) => {
  const user = { username: "YourUser IsNameWhat" };

  return (
    <nav className="w-full h-[72px] flex items-center justify-between px-8 border-b border-gray-300 bg-white">
      <div className="flex items-center gap-6">
        <div className="text-[#5b4085] font-bold italic text-lg">
          Career <br /> Advisory
        </div>
        <button
          onClick={onToggleLang}
          className="flex items-center gap-2 text-[#5b4085] font-medium hover:underline"
        >
          🌐 {lang === "en" ? "TH" : "EN"}
        </button>
      </div>

      <div className="text-[#5b4085] font-semibold">Dashboard</div>

      <div className="text-gray-700 font-medium">{user.username}</div>
    </nav>
  );
};

export default Navbar;
