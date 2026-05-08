"use client";

import React from "react";
import AdminGuard from "./AdminGuard";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
        <div className="flex min-h-screen">
          <AdminSidebar />

          <div className="min-w-0 flex-1">
            <AdminHeader />

            <section className="px-5 py-7 lg:px-8">{children}</section>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}