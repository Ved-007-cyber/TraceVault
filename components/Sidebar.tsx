"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (data) {
    setName(data.full_name);
    setRole(data.role);
    setDepartment(data.department);
  }
}

  const facultyMenu = [
  {
    name: "Dashboard",
    href: "/roles/faculty",
    icon: "🏠",
  },
  {
    name: "Documents",
    href: "/files",
    icon: "📄",
  },
  {
    name: "Upload",
    href: "/upload",
    icon: "⬆️",
  },
  {
    name: "Shared Files",
    href: "/share",
    icon: "🔗",
  },
  {
    name: "Audit Trail",
    href: "/audit",
    icon: "📜",
  },
];

const studentMenu = [
  {
    name: "Dashboard",
    href: "/roles/student",
    icon: "🏠",
  },
  {
    name: "Shared Documents",
    href: "/student/files",
    icon: "📄",
  },
  {
    name: "Downloads",
    href: "/student/downloads",
    icon: "⬇️",
  },
  {
    name: "Activity",
    href: "/student/activity",
    icon: "🕒",
  },
];

const adminMenu = [
  {
    name: "Dashboard",
    href: "/roles/admin",
    icon: "🏠",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: "👥",
  },
  {
    name: "Audit Logs",
    href: "/admin/audit",
    icon: "📜",
  },
];

const menuItems =
  role === "student"
    ? studentMenu
    : role === "admin"
    ? adminMenu
    : facultyMenu;

  return (
    <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col">

      {/* Logo */}
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-4xl font-bold text-cyan-400">
          TraceVault
        </h1>

        <p className="text-slate-400 mt-2">
          Secure Sharing
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-3">

        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 p-4 rounded-xl transition
              ${
                pathname === item.href
                  ? "bg-cyan-500 text-black font-semibold"
                  : "text-white hover:bg-slate-900"
              }`}
          >
            <span className="text-xl">
              {item.icon}
            </span>

            {item.name}
          </Link>
        ))}

      </nav>

      {/* User Section */}
      <div className="border-t border-slate-800 p-6">

        <h3 className="text-white font-semibold text-lg">
          {name}
        </h3>

        <p className="text-cyan-400 text-sm mt-1">
          {role.toUpperCase()} • {department}
        </p>

        <button
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
        >
          Logout
        </button>

      </div>

    </aside>
  );
}