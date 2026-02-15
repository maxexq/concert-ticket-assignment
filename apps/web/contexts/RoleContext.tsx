"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export type UserRole = "user" | "admin";

export const ROLE_STORAGE_KEY = "user_role";

interface RoleContextType {
  role: UserRole;
  switchRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const [role, setRole] = useState<UserRole>("admin");
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem(
      ROLE_STORAGE_KEY,
    ) as UserRole | null;
    if (storedRole && (storedRole === "admin" || storedRole === "user")) {
      setRole(storedRole);
    }
  }, []);

  const switchRole = () => {
    setRole((prev) => {
      const newRole = prev === "admin" ? "user" : "admin";
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
      return newRole;
    });
    router.push("/");
  };

  return (
    <RoleContext.Provider value={{ role, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
