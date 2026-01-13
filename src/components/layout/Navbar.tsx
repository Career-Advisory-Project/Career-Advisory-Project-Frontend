"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type UserInfo = {
  cmuitaccount_name: string;
  cmuitaccount: string;
  firstname_EN: string;
  lastname_EN: string;
  firstname_TH: string; // แก้ String -> string (TS convention)
  lastname_TH: string; // แก้ String -> string
  organization_name_EN: string;
  itaccounttype_EN: string;
};

const Navbar = ({
  lang,
  onToggleLang,
}: {
  lang: "en" | "th";
  onToggleLang: () => void;
}) => {
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ใช้ AbortController ป้องกัน Error ถ้า Component ถูกปิดก่อนโหลดเสร็จ
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me", {
          signal: controller.signal,
        });

        if (response.data.ok && response.data.user) {
          const user = response.data.user;

          // Logic การบล็อก Student/Alumni
          // const userType = (user.itaccounttype_EN || "").toLowerCase();
          // if (userType.includes("student") || userType.includes("alumni")) {
          //   console.warn("Unauthorized access attempt by student/alumni.");
          //   // แจ้งเตือนผู้ใช้
          //   alert("⛔ Access Denied: This system is for Instructors only.");
          //   // สั่ง Logout ที่ Backend เพื่อลบ Cookie
          //   await axios.post("/api/auth/signout");
          //   // ดีดกลับหน้าแรกทันที
          //   window.location.href = "/";
          //   return;
          // }

          // ถ้าไม่ใช่ Student ค่อยแสดงข้อมูล
          setUserData(user);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("User not logged in or session expired");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => controller.abort(); // Cleanup function
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
            <span className="text-xs text-gray-500">
              {userData.itaccounttype_EN}
            </span>
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
