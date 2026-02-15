"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "user" | "admin";

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

  const switchRole = () => {
    setRole((prev) => (prev === "admin" ? "user" : "admin"));
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
