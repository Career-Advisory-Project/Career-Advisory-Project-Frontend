"use client"; // ต้องใส่เพื่อให้ใช้ useState, useEffect ได้
import axios from "axios";
import { useEffect, useState } from "react";

// กำหนด Type ของข้อมูล User ให้ตรงกับที่ Backend ส่งมา
type UserInfo = {
  cmuitaccount_name: string;
  cmuitaccount: string;
  firstname_EN: string;
  lastname_EN: string;
  firstname_TH: String;
  lastname_TH: String;
  organization_name_EN: string;
};

const Navbar = ({
  lang,
  onToggleLang,
}: {
  lang: "en" | "th";
  onToggleLang: () => void;
}) => {
  // สร้าง State ไว้เก็บข้อมูล User
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูล User เมื่อ Component โหลดเสร็จ
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // เรียก API ที่เราเตรียมไว้ (ต้องแน่ใจว่าสร้างไฟล์ api/auth/me แล้ว)
        const response = await axios.get("/api/auth/me");

        if (response.data.ok && response.data.user) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("User not logged in or session expired");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="relative w-full h-[72px] flex items-center justify-between px-8 border-b border-gray-300 bg-white">
      <div className="flex items-center gap-6 z-10">
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

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#5b4085] font-semibold">
        Dashboard
      </div>

      {/* แสดงชื่อ User */}
      <div className="text-gray-700 font-medium z-10">
        {loading ? (
          <span>Loading...</span>
        ) : userData ? (
          <div className="flex flex-col items-end leading-tight">
            {lang === "th"
              ? `${userData.firstname_TH} ${userData.lastname_TH}`
              : `${userData.firstname_EN} ${userData.lastname_EN}`}
            {/* <span className="text-xs text-gray-500">{userData.cmuitaccount}</span> */}
          </div>
        ) : (
          <a href="/" className="text-blue-600 hover:underline">
            Sign In
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
