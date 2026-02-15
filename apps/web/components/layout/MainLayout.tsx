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
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        <div className="sticky top-0 z-30 flex items-center gap-4 p-4 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold">Concert Tickets</span>
        </div>
        <div className="flex flex-col gap-4 px-10 py-16">{children}</div>
      </main>
    </div>
  );
};

export default React.memo(MainLayout);
