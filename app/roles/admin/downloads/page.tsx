"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function DownloadHistoryPage() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloads();
  }, []);

  async function loadDownloads() {
    const { data, error } = await supabase
      .from("downloads")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      const history = await Promise.all(
        data.map(async (item) => {
          const { data: user } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", item.user_id)
            .single();

          const { data: document } =
            await supabase
              .from("documents")
              .select("title")
              .eq(
                "document_id",
                item.document_id
              )
              .single();

          return {
            ...item,
            user_name:
              user?.full_name ||
              "Unknown User",
            document_name:
              document?.title ||
              "Unknown Document",
          };
        })
      );

      setDownloads(history);
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-10 text-white">

        <h1 className="text-5xl font-bold mb-8">
          Download History
        </h1>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-800">

                <th className="p-4 text-left">
                  Student
                </th>

                <th className="p-4 text-left">
                  Document
                </th>

                <th className="p-4 text-left">
                  Download Time
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-6 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : downloads.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-6 text-center"
                  >
                    No Downloads Found
                  </td>
                </tr>
              ) : (
                downloads.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800"
                  >
                    <td className="p-4">
                      {item.user_name}
                    </td>

                    <td className="p-4">
                      {item.document_name}
                    </td>

                    <td className="p-4">
                      {new Date(
                        item.created_at
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