"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadActivity();
  }, []);

  async function loadActivity() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !logs) return;

  const enrichedLogs = await Promise.all(
    logs.map(async (log) => {
      const { data: doc } = await supabase
        .from("documents")
        .select("title")
        .eq("document_id", log.document_id)
        .single();

      return {
        ...log,
        title: doc?.title || log.document_id,
      };
    })
  );

  setActivities(enrichedLogs);
  setLoading(false);
}

  return (
    <div className="flex min-h-screen bg-slate-950">
      <StudentSidebar />

      <main className="flex-1 p-10 text-white">

        <h1 className="text-5xl font-bold mb-8">
          Activity History
        </h1>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-4 text-left">
                  Document
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

              {activities.map((item) => (
                <tr
                  key={item.audit_id}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">
                    {item.title}
                  </td>

                  <td className="p-4">
                    {item.action}
                  </td>

                  <td className="p-4">
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </main>
    </div>
  );
}