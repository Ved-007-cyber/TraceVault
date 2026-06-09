"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function SharesPage() {
  const [shares, setShares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShares();
  }, []);

  async function loadShares() {
    const { data, error } = await supabase
      .from("sharelinks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setShares(data);
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-10 text-white">

        <h1 className="text-5xl font-bold mb-8">
          Shared Files Monitoring
        </h1>

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-800">

                <th className="p-4 text-left">
                  Document
                </th>

                <th className="p-4 text-left">
                  Student
                </th>

                <th className="p-4 text-left">
                  Faculty
                </th>

                <th className="p-4 text-left">
                  Permission
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Access Count
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : shares.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center"
                  >
                    No Shared Files Found
                  </td>
                </tr>
              ) : (
                shares.map((share) => (
                  <tr
                    key={share.share_id}
                    className="border-b border-slate-800"
                  >

                    <td className="p-4">
                      {share.document_title}
                    </td>

                    <td className="p-4">
                      {share.shared_with_name}
                    </td>

                    <td className="p-4">
                      {share.shared_by_name}
                    </td>

                    <td className="p-4">
                      {share.permission}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          share.status === "active"
                            ? "bg-green-500 text-black"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {share.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {share.access_count || 0}
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