import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type UserInfo = {
  cmuitaccount_name: string;
  cmuitaccount: string;
  firstname_EN: string;
  lastname_EN: string;
  firstname_TH: string;
  lastname_TH: string;
  organization_name_EN: string;
  itaccounttype_EN: string;
};

type AuthContextType = {
  user: UserInfo | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        if (data.ok && data.user) {
          setUser(data.user);

            // Check admin status from backend API
            try {
              const adminRes = await fetch(
                `/api/admin/check/${data.user.cmuitaccount}`,
                { signal: controller.signal }
              );
              if (adminRes.ok) {
                const adminData = await adminRes.json();
                setIsAdmin(adminData.isAdmin === true);
              }
            } catch {
              // Admin API not available yet — default to false
            setIsAdmin(true);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Auth check failed:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => controller.abort();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
