"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminSidebar() {
  const router = useRouter();

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
          Admin Portal
        </p>
      </div>

      <nav className="flex-1 p-6 space-y-4">

        <Link
          href="/roles/admin"
          className="block bg-cyan-500 text-black font-semibold px-5 py-4 rounded-xl"
        >
          🏠 Dashboard
        </Link>

        <Link
          href="/roles/admin/users"
          className="block text-white hover:bg-slate-900 px-5 py-4 rounded-xl"
        >
          👥 Users
        </Link>

        <Link
          href="/roles/admin/documents"
          className="block text-white hover:bg-slate-900 px-5 py-4 rounded-xl"
        >
          📄 Documents
        </Link>

        <Link
          href="/roles/admin/shares"
          className="block text-white hover:bg-slate-900 px-5 py-4 rounded-xl"
        >
          🔗 Shared Files
        </Link>

        <Link
          href="/roles/admin/audit"
          className="block text-white hover:bg-slate-900 px-5 py-4 rounded-xl"
        >
          📜 Audit Logs
        </Link>

      </nav>

      <div className="p-6 border-t border-slate-800">

        <h3 className="text-white font-bold text-xl">
          Administrator
        </h3>

        <p className="text-cyan-400 mt-2 mb-6">
          SYSTEM ADMIN
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