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
              Shared Files Monitoring
            </h1>

            <p className="text-slate-400 text-white mt-2 text-lg">
              Track document sharing activity across TraceVault
            </p>
          </div>

        </div>

        

        <div className="
          bg-slate-900/70
          backdrop-blur-md

          border
          border-slate-800

          rounded-xl

          overflow-hidden
          "
        >

          <table className="w-full">

            <thead className="bg-slate-800/80">
              <tr>

              <th className="px-6 py-5 text-left">
                Document
              </th>

              <th className="px-6 py-5 text-left">
                Student
              </th>

              <th className="px-6 py-5 text-left">
                Faculty
              </th>

              <th className="px-6 py-5 text-left">
                Permission
              </th>

              <th className="px-6 py-5 text-left">
                Status
              </th>

              <th className="px-6 py-5 text-center">
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

                    <td className="px-6 py-5">
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

                        <span className="font-medium">
                          {share.document_title}
                        </span>

                      </div>

                    </td>

                    <td className="p-4">
                      {share.shared_with_name}
                    </td>

                    <td className="p-4">
                      {share.shared_by_name}
                    </td>

                    <td>
                      <span
                        className="
                        px-3
                        py-1

                        rounded-full

                        bg-blue-500/20

                        text-blue-400

                        text-sm
                        "
                      >
                        {share.permission}
                      </span>
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

                    <td className="px-6 py-5 text-center">
                      <span
                        className="
                        px-4
                        py-2

                        rounded-full

                        bg-cyan-500/20

                        text-cyan-400

                        font-bold
                        "
                      >
                        {share.access_count}
                      </span>
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