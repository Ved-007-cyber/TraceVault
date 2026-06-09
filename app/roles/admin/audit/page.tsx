"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

        const { data: user } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", log.user_id)
          .single();

        return {
          ...log,
          documentTitle:
            document?.title || log.document_id,
          userName:
            user?.full_name || "Unknown User",
        };
      })
    );

    setLogs(enrichedLogs);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-10 text-white">
        <h1 className="text-5xl font-bold mb-8">
          Audit Logs
        </h1>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

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
                logs.map((log) => (
                  <tr
                    key={log.audit_id}
                    className="border-b border-slate-800"
                  >
                    <td className="p-4">
                      {log.documentTitle}
                    </td>

                    <td className="p-4">
                      {log.userName}
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
  );
}