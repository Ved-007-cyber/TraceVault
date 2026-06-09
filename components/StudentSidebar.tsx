"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function StudentSidebar() {
  const router = useRouter();

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

  return (
    <aside className="w-80 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      <div className="p-8 border-b border-slate-800">
        <h1 className="text-6xl font-bold text-cyan-400">
          TraceVault
        </h1>

        <p className="text-slate-400 mt-3">
          Student Portal
        </p>
      </div>

      <nav className="flex-1 p-6 space-y-4">

        <Link
          href="/roles/student"
          className="block bg-cyan-500 text-black font-semibold px-5 py-4 rounded-xl"
        >
          🏠 Dashboard
        </Link>

        <Link
          href="/roles/student/files"
          className="block text-white hover:bg-slate-900 px-5 py-4 rounded-xl"
        >
          📄 Shared Documents
        </Link>

        <Link
          href="/roles/student/downloads"
          className="block text-white hover:bg-slate-900 px-5 py-4 rounded-xl"
        >
          ⬇ Downloads
        </Link>

        <Link
          href="/roles/student/activity"
          className="block text-white hover:bg-slate-900 px-5 py-4 rounded-xl"
        >
          🕒 Activity
        </Link>

      </nav>

      <div className="p-6 border-t border-slate-800">

        <h3 className="font-bold text-xl text-white">
          {student?.full_name || "Student"}
        </h3>

        <p className="text-cyan-400 mt-2 mb-6">
          {student?.role?.toUpperCase()} • {student?.department}
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
        >
          Logout
        </button>

      </div>

    </aside>
  );
}