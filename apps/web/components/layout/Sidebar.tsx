"use client";

import { Home, History, RefreshCw, X, LogOut } from "lucide-react";
import React from "react";
import { MenuButton, MenuButtonType } from "../atoms";
import { useRole } from "@/contexts";

interface ISidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = (props: ISidebarProps) => {
  const { isOpen, onClose } = props;
  const { role, switchRole } = useRole();

  const isAdmin = role === "admin";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-60 bg-white border-r border-[#E7E7E7]
          transform transition-transform duration-300 ease-in-out flex flex-col
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden shrink-0">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col flex-1 min-h-0 py-10 lg:py-10">
          <h1 className="p-6 text-[40px] font-semibold shrink-0">
            {isAdmin ? "Admin" : "User"}
          </h1>
          <ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {isAdmin && (
              <li className="p-2">
                <MenuButton title="Home" href="/" icon={Home} />
              </li>
            )}
            <li className="p-2">
              <MenuButton title="History" href="/history" icon={History} />
            </li>
            <li className="p-2">
              <MenuButton
                title={isAdmin ? "Switch to User" : "Switch to Admin"}
                icon={RefreshCw}
                type={MenuButtonType.BUTTON}
                onClick={switchRole}
              />
            </li>
          </ul>
          <ul className="shrink-0 p-2">
            <li className="p-2">
              <MenuButton
                title="Logout"
                icon={LogOut}
                type={MenuButtonType.BUTTON}
              />
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default React.memo(Sidebar);
