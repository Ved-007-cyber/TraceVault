"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter,setActionFilter] = useState("all");

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
        const { data: document } = await supabase
          .from("documents")
          .select("title")
          .eq("document_id", log.document_id)
          .single();

        const { data: student } = await supabase
          .from("profiles")
          .select("full_name, department")
          .eq("id", log.user_id)
          .single();

        return {
          ...log,
          documentTitle:
            document?.title || log.document_id,
          studentName:
            student?.full_name || "Unknown",
          department:
            student?.department || "-",
        };
      })
    );

    setLogs(enrichedLogs);
    setLoading(false);
  }

  const filteredLogs = logs.filter((log) => {

  const matchesSearch =
    log.documentTitle
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||

    log.studentName
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchesAction =
    actionFilter === "all"
      ? true
      : log.action
          ?.toLowerCase()
          .includes(
            actionFilter.toLowerCase()
          );

  return matchesSearch && matchesAction;
});

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/faculty-bg')",
        }}
      />

      <div className="relative z-10 flex min-h-screen">

        <Sidebar />

        <main className="flex-1 p-10 overflow-x-auto text-white">

          {/* Header */}
          <h1 className="text-6xl font-bold">
            Audit Trail
          </h1>

          <p className="text-slate-300 mt-2 mb-8">
            Track document activity and user actions
          </p>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                h-14
                px-5
                rounded-2xl
                bg-slate-900/70
                border
                border-slate-700
                text-white
                focus:outline-none
                focus:border-cyan-500
              "
            />
          </div>

          <div className="felx gap-4 mb-8">
            <select
              value={actionFilter}
              onChange={(e)=>
                setActionFilter(e.target.value)
              }
              className="
              bg-slate-900/70
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
              ">
                <option value = "all">
                  All Action
                </option>
                <option value = "View">
                  Viewed
                </option>
                <option value = "Share">
                  Share
                </option>
                <option value = "Download">
                  Downloaded
                </option>
                <option value = "Delete">
                  Deleted
                </option>
              </select>
          </div>

          {/* Table */}
          <div
            className="
              bg-slate-900/60
              backdrop-blur-md
              rounded-1xl
              border
              border-slate-800
              overflow-hidden
            "
          >
            <table className="w-full">

              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800">

                  <th className="p-5 text-left">
                    Document
                  </th>

                  <th className="p-5 text-left">
                    User
                  </th>

                  <th className="p-5 text-left">
                    Department
                  </th>

                  <th className="p-5 text-left">
                    Action
                  </th>

                  <th className="p-5 text-left">
                    Time
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center"
                    >
                      Loading...
                    </td>
                  </tr>

                ) : filteredLogs.length === 0 ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center"
                    >
                      No Activity Found
                    </td>
                  </tr>

                ) : (

                  filteredLogs.map(
                    (log, index) => (

                      <tr
                        key={index}
                        className="
                          border-b
                          border-slate-800
                          hover:bg-slate-800/30
                          transition
                        "
                      >

                        <td className="p-5">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                w-10
                                h-10
                                rounded-xl
                                bg-cyan-500/20
                                flex
                                items-center
                                justify-center
                              "
                            >
                              📄
                            </div>

                            <div>

                              <p className="font-medium">
                                {log.documentTitle}
                              </p>

                              <p className="text-xs text-slate-400">
                                {log.document_id}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="p-5">
                          {log.studentName}
                        </td>

                        <td className="p-5">
                          {log.department}
                        </td>

                        <td className="p-5">
                          {log.action?.toLowerCase().includes("view") && (
                            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
                              Viewed
                            </span>
                          )}

                          {log.action?.toLowerCase().includes("share") && (
                            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                              Shared
                            </span>
                          )}

                          {log.action?.toLowerCase().includes("download") && (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                              Downloaded
                            </span>
                          )}

                          {log.action?.toLowerCase().includes("upload") && (
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                              Uploaded
                            </span>
                          )}

                          {log.action?.toLowerCase().includes("delete") && (
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400">
                              Deleted
                            </span>
                          )}

                        </td>

                        <td className="p-5 text-slate-400">
                          {new Date(
                            log.created_at
                          ).toLocaleString()}
                        </td>

                      </tr>
                    )
                  )

                )}

              </tbody>

            </table>
          </div>

        </main>
      </div>
    </div>
  );
}