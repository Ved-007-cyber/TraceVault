"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    const enrichedLogs = await Promise.all(
      data.map(async (log) => {
        const { data: user } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", log.user_id)
          .single();

        const { data: document } = await supabase
          .from("documents")
          .select("title")
          .eq("document_id", log.document_id)
          .single();

        return {
          ...log,
          user_name: user?.full_name || "Unknown User",
          document_title:
            document?.title || "Unknown Document",
        };
      })
    );

    setLogs(enrichedLogs);
    setLoading(false);
    
  }

  const filteredLogs = logs.filter((log) => {
  const matchesSearch =
    log.document_title
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||

    log.user_name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||

    log.action
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchesFilter =
    filter === "all"
      ? true
      : log.action === filter;

  return matchesSearch && matchesFilter;
});

  return (
    <div className="relative min-h-screen overflow-hidden">

    {/* Background Image */}

    <div
      className="
      absolute
      inset-0
      bg-cover
      bg-center
      bg-no-repeat
      "
      style={{
        backgroundImage:
          "url('/admin-bg.jpg')",
      }}
    />
    {/* Dashboard Content */}

    <div className="relative z-10 flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-10 text-white">
        <div className="flex justify-between items-center mb-8">
          <div>

            <h1 className="text-6xl font-bold text-white">
              Audit Logs
            </h1>

            <p className="text-slate-400 text-white mt-2 text-lg">
              Monitor user activity and system events
            </p>

          </div>

        </div>
        <input
          type="text"
          placeholder="Search document, user, action..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
          w-full
          h-14
          mb-8
          px-5

          rounded-2xl

          bg-slate-900/70
          backdrop-blur-md

          border
          border-slate-700

          text-white

          focus:border-cyan-400
          focus:outline-none
          "
        />
        <div className="flex gap-3 mb-8">
          <button
            onClick={() =>
              setFilter("all")
            }
            className="px-5 py-2 rounded-xl bg-bg-slate-800"
          >
            All
          </button>

          <button
            onClick={() =>
              setFilter("Viewed")
            }
            className="px-5 py-2 rounded-xl bg-green-500/20 text-green-400"
          >
            Viewed
          </button>

          <button
            onClick={() =>
              setFilter("Downloaded")
            }
            className="px-5 py-2 rounded-xl bg-cyan-500/20 text-cyan-400"
          >
            Downloaded
          </button>

          <button
            onClick={() =>
              setFilter("Shared")
            }
            className="px-5 py-2 rounded-xl bg-yellow-500/20 text-yellow-400"
          >
            Shared
          </button>

        </div>

        <div className="
            bg-slate-900/70
            backdrop-blur-md

            border
            border-slate-800

            rounded-1xl

            overflow-hidden
            "
          >

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-800">

                <th className="p-4 text-left">
                  Document
                </th>

                <th className="p-4 text-left">
                  User
                </th>

                <th className="p-4 text-left">
                  Action
                </th>

                <th className="p-4 text-left">
                  Time
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center"
                  >
                    No Audit Logs Found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.audit_id}
                    className="border-b border-slate-800"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                          📄
                        </div>

                        <div>
                          <p className="font-medium text-white">
                            {log.document_title || log.document_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {log.user_name}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          log.action === "Downloaded"
                            ? "bg-cyan-500 text-black"
                            : log.action === "Viewed"
                            ? "bg-green-500 text-black"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {log.action}
                      </span>

                    </td>

                    <td className="p-4">
                      {new Date(
                        log.created_at
                      ).toLocaleString()}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </main>
    </div>
    </div>
  );
}