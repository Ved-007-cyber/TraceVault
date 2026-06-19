"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    router.push("/");
  }

  const navClass = (path: string) =>
    `
    w-[95%]
    mx-auto

    h-20

    flex
    items-center

    px-8

    rounded-[32px]

    text-2xl
    font-semibold

    transition-all
    duration-300

    ${
      pathname === path
        ? `
          bg-cyan-500
          text-black
          shadow-[0_0_20px_rgba(6,182,212,0.35)]
        `
        : `
          bg-slate-900
          text-white
          hover:bg-slate-800
        `
    }
  `;

  return (
    <aside
      className="
      w-[360px]
      min-h-screen
      bg-gradient-to-b
      from-slate-950
      via-slate-900
      to-blue-950

      border-r
      border-slate-500/20
      backdrop-blur-xl
      flex
      flex-col
      "
    >
      {/* Logo */}

      <div className="px-6 pt-6">
        <h1
          className="
          text-5xl
          font-extrabold
          text-cyan-400
          drop-shadow-[0_0_15px_#06b6d4]
          "
        >
          TraceVault
        </h1>

        <p
          className="
          text-slate-400
          text-lg
          mt-1
          "
        >
          Admin Control Center
        </p>
      </div>

      {/* Navigation */}

      <nav
        className="
        mt-8

        flex
        flex-col

        gap-5
        "
      >
        <Link
          href="/roles/admin"
          className={navClass("/roles/admin")}
        >
          <span className="text-2xl text-bold flex-1

            flex
            items-center

            justify-center"
            >
              🏠 Dashboard
            </span>
        </Link>

        <Link
          href="/roles/admin/users"
          className={navClass("/roles/admin/users")}
        >
          <span className="text-2xl text-bold flex-1

            flex
            items-center

            justify-center"
            >
              👥 Users
            </span>
        </Link>

        <Link
          href="/roles/admin/documents"
          className={navClass("/roles/admin/documents")}
        >
          <span className="text-2xl text-bold flex-1

            flex
            items-center

            justify-center"
            >
              📄 Documents
            </span>
        </Link>

        <Link
          href="/roles/admin/shares"
          className={navClass("/roles/admin/shares")}
        >
          <span className="text-2xl text-bold flex-1

            flex
            items-center

            justify-center">
              🔗 Shared Files
            </span>

        </Link>

        <Link
          href="/roles/admin/audit"
          className={navClass("/roles/admin/audit")}
        >
          <span className="text-2xl text-bold flex-1

            flex
            items-center

            justify-center">📜 Audit Logs</span>

          
        </Link>
      </nav>

      {/* Push Footer Down */}

      <div className="flex-1" />

      {/* Footer */}

      <div
        className="
        border-t
        border-slate-800

        p-6
        "
      >
        <div
          className="
          bg-slate-900

          rounded-3xl

          p-5

          border
          border-slate-800
          "
        >
          <h3
            className="
            text-4xl
            font-bold
            text-white
            "
          >
            Administrator
          </h3>

          <p
            className="
            text-cyan-400

            text-lg

            tracking-[4px]

            mt-2
            mb-6
            "
          >
            SYSTEM ADMIN
          </p>

          <button
            onClick={handleLogout}
            className="
            w-[95%]

            h-14

            block
            mx-auto

            rounded-full

            bg-red-500
            hover:bg-red-600

            text-white

            text-xl
            font-bold

            transition
            "
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}