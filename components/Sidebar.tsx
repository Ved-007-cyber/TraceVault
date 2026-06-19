"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState<any>(null);



  useEffect(() => {
    loadProfile();
    loadFaculty();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    localStorage.removeItem("user");

    router.push("/");
  }


  async function loadFaculty() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .single();

    setFaculty(data);
  }

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
      icon: "📚",
    },
    {
      name: "Documents",
      href: "/files",
      icon: "📄",
    },
    {
      name: "Upload",
      href: "/upload",
      icon: "📥",
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
      name: "Documents",
      href: "/admin/documents",
      icon: "📄",
    },
    {
      name: "Shared Files",
      href: "/admin/shared",
      icon: "🔗",
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
    <aside
      className="
      w-[380px]
      min-w-[380px]
      h-screen
      bg-[#061225]/95
      backdrop-blur-xl

      border-r
      border-cyan-500/20

      flex
      flex-col
      "
    >
  {/* Logo */}
      <div className="px-8 py-6 border-b border-white/10">

        <h1
          className="
          text-6xl
          font-black
          text-cyan-400
          drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]
          "
        >
          TraceVault
        </h1>
        <h1
          className="
          text-3xl
          font-semibold
          text-white
          "
        >
          Faculty access
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-8 space-y-6">

        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="
              relative
              flex
              items-center
              justify-center
              h-[88px]
              rounded-[32px]
              overflow-hidden
            "
          >
            {pathname === item.href && (
              <motion.div
                layoutId="activeSidebar"
                className="
                  absolute
                  inset-0
                  bg-cyan-500
                  rounded-[32px]
                  shadow-[0_0_35px_rgba(6,182,212,0.45)]
                "
                transition={{
                  type: "spring", 
                  stiffness: 400,
                  damping: 35,
                }}
              />
            )}

            <div
              className={`
                relative
                z-10
                flex
                items-center
                gap-5

                ${
                  pathname === item.href
                    ? "text-black font-bold"
                    : "text-white"
                }
              `}
            >
              <span className="text-4xl">
                {item.icon}
              </span>

              <span className="text-[22px]">
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Faculty Card */}
      <div
        className="
        m-4
        p-6
        rounded-[30px]
        bg-slate-900/80
        border
        border-cyan-500/20
        backdrop-blur-xl
        "
      >

        <Link
          href="/roles/faculty/profile"
          className="
          flex
          items-center
          gap-4
          mb-4
          cursor-pointer
          hover:opacity-90
          transition
          "
        >
          <img
            src={
              faculty?.profile_photo?.trim()
                ? faculty.profile_photo
                : faculty?.gender === "female"
                ? "/default-female.png"
                : "/default-male.png"
            }
            alt="Profile"
            className="
            w-20
            h-20
            rounded-full
            object-cover
            border-2
            border-cyan-500
            "
          />

          <div>
            <h3 className="text-white text-2xl font-bold">
              {faculty?.full_name || "Faculty"}
            </h3>

            <p className="text-cyan-400 tracking-[3px]">
              FACULTY • {faculty?.department}
            </p>
          </div>

        </Link>

        <button
          onClick={handleLogout}
          className="
          w-full
          bg-red-500
          hover:bg-red-600
          text-white
          py-4
          rounded-full
          text-xl
          font-bold
          transition
          "
        >
          Logout
        </button>

      </div>


    </aside>
  );

}