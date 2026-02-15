"use client";

import { X } from "lucide-react";
import React from "react";

interface ISidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = (props: ISidebarProps) => {
  const { isOpen, onClose } = props;

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
          fixed top-0 left-0 z-50 h-screen w-60 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="py-10">
          <h1 className="p-6 text-[40px] font-semibold">User</h1>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="#"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                History
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Switch to user
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default React.memo(Sidebar);
