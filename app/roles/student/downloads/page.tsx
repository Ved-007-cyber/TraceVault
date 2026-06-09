"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloads();
  }, []);

  async function loadDownloads() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: downloadsData, error } = await supabase
      .from("downloads")
      .select("*")
      .eq("user_id", user.id)
      .order("downloaded_at", { ascending: false });

    if (error || !downloadsData) {
      setLoading(false);
      return;
    }

    const enrichedData = await Promise.all(
      downloadsData.map(async (item) => {
        const { data: doc } = await supabase
          .from("documents")
          .select("title")
          .eq("document_id", item.document_id)
          .single();

        return {
          ...item,
          title: doc?.title || item.document_id,
        };
      })
    );

    setDownloads(enrichedData);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <StudentSidebar />

      <main className="flex-1 p-10 text-white">
        <h1 className="text-5xl font-bold mb-8">
          Download History
        </h1>

        <div className="bg-slate-900 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-4 text-left">
                  Document
                </th>

                <th className="p-4 text-left">
                  Downloaded At
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    className="p-6 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : downloads.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="p-6 text-center"
                  >
                    No downloads found
                  </td>
                </tr>
              ) : (
                downloads.map((item: any) => (
                  <tr
                    key={item.download_id}
                    className="border-b border-slate-800"
                  >
                    <td className="p-4">
                      {item.title}
                    </td>

                    <td className="p-4">
                      {new Date(
                        item.downloaded_at
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