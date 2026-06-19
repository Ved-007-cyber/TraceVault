"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function StudentSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    loadStudent();
  }, []);

  async function loadStudent() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .single();

    setStudent(data);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    router.push("/");
  }

  const menuItems = [
    {
      name: "Dashboard",
      href: "/roles/student",
      icon: "🏠",
    },
    {
      name: "Shared Documents",
      href: "/roles/student/files",
      icon: "📄",
    },
    {
      name: "Downloads",
      href: "/roles/student/downloads",
      icon: "⬇️",
    },
    {
      name: "Activity",
      href: "/roles/student/activity",
      icon: "🕒",
    },
  ];

  return (
    <aside
      className="
      w-[360px]
      min-w-[360px]
      lg:w-[400px]
      lg:min-w-[400px]
      h-screen
      bg-slate-950/95
      backdrop-blur-xl
      border-r
      border-white/10
      flex
      flex-col
      shadow-2xl
      "
    >
      {/* Logo */}
      <div className="p-8 border-b border-white/10">

        <h1
          className="
          text-6xl
          font-black
          text-cyan-400
          drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]
          "
        >
          TraceVault
        </h1>

        <p className="text-slate-400 text-2xl mt-2">
          Student Portal
        </p>

      </div>

      {/* Navigation */}
      <nav className="flex-1  px-6 py-8 space-y-4">

        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center justify-center
              h-[72px]
              gap-5
              px-8
              py-6
              rounded-[30px]
              text-[28px]
              font-semibold
              transition-all
              duration-300

              ${
                pathname === item.href
                  ? `
                  bg-cyan-500
                  text-black
                  shadow-[0_0_30px_rgba(6,182,212,0.45)]
                  `
                  : `
                  bg-slate-900/70
                  text-white
                  hover:bg-slate-800
                  hover:translate-x-1
                  `
              }
            `}
          >
            <span className="text-3xl">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </Link>
        ))}

      </nav>

      {/* User Card */}
      <div
  className="
  m-5
  p-5
  rounded-[28px]
  bg-slate-900/90
  border border-cyan-500/20
  backdrop-blur-xl
  "
>

  <Link
    href="/roles/student/profile"
    className="
    flex
    items-center
    gap-4
    mb-5
    hover:opacity-90
    transition-all
    "
  >
    <img
      src={
        student?.profile_photo
          ? `${student.profile_photo}?t=${Date.now()}`
          : student?.gender === "female"
          ? "/default-female.png"
          : "/default-male.png"
      }
      alt="Profile"
      className="
      w-20
      h-20
      rounded-full
      object-cover
      border-[3px]
      border-cyan-400
      shadow-[0_0_20px_rgba(34,211,238,0.4)]
      flex-shrink-0
      "
    />

    <div className="min-w-0">
      <h3
        className="
        text-white
        text-xl
        font-bold
        truncate
        "
      >
        {student?.full_name || "Student"}
      </h3>

      <p
        className="
        text-cyan-400
        text-sm
        tracking-[4px]
        uppercase
        "
      >
        STUDENT • {student?.department}
      </p>
    </div>
  </Link>

  <button
    onClick={handleLogout}
    className="
    w-full h-10
    bg-red-500
    hover:bg-red-600
    text-white
    py-3
    rounded-full
    font-bold
    transition-all
    text-xl
    "
  >
    Logout
  </button>
</div>
    </aside>
  );
}