"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import React from "react";

interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = (props: IMainLayoutProps) => {
  const { children } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="sticky top-0 z-30 flex items-center gap-4 p-4 bg-white border-b border-gray-200 lg:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold">Free Concert Tickets</span>
        </div>
        <div className="flex flex-col gap-12 px-5 py-8   md:px-10 md:py-16 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default React.memo(MainLayout);
