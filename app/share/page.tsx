"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function FacultySharedPage() {

  const [shares, setShares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadShares();
  }, []);

  async function loadShares() {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("sharelinks")
      .select("*")
      .eq("shared_by_email", user.email)
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setShares(data || []);
    }

    setLoading(false);
  }

  async function revokeAccess(
    shareId: string
  ) {

    const confirmDelete =
      window.confirm(
        "Revoke access?"
      );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("sharelinks")
      .delete()
      .eq("share_id", shareId);

    if (error) {
      alert(error.message);
      return;
    }

    loadShares();
  }

  const filteredShares =
    shares.filter((share) =>
      share.document_title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      share.shared_with_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="relative min-h-screen overflow-hidden">

      <div
        className="
        absolute
        inset-0
        bg-cover
        bg-center
        "
        style={{
          backgroundImage:
            "url('/faculty-bg')",
        }}
      />

      <div className="relative z-10 flex min-h-screen">

        <div className="shrink-0">
          <Sidebar />
        </div>

        <main className="flex-1 p-10 overflow-x-auto text-white">

          <h1 className="text-6xl font-bold">
            Shared Files
          </h1>

          <p className="text-slate-300 mb-8">
            Manage shared documents
          </p>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
            w-full
            h-14
            px-5
            mb-8
            rounded-2xl
            bg-slate-900/70
            border
            border-slate-700
            "
          />

          <div
            className="
            bg-slate-900/70
            backdrop-blur-xl
            rounded-1xl
            border
            border-cyan-500/10
            shadow-xl
            overflow-hidden
            "
          >

            <table className="w-full">

              <thead>

                <tr className="bg-slate-800/70
                    border-b
                    border-slate-700
                    "
                  >

                  <th className="
                      p-5
                      text-left
                      font-semibold
                      text-cyan-400
                      uppercase
                      tracking-wide
                      text-sm
                      "
                  >
                    Document
                  </th>

                  <th className="
                      p-5
                      text-left
                      font-semibold
                      text-cyan-400
                      uppercase
                      tracking-wide
                      text-sm
                      "
                  >
                    Student
                  </th>

                  <th className="
                      p-5
                      text-left
                      font-semibold
                      text-cyan-400
                      uppercase
                      tracking-wide
                      text-sm
                      "
                  >
                    Department
                  </th>

                  <th className="
                      p-5
                      text-left
                      font-semibold
                      text-cyan-400
                      uppercase
                      tracking-wide
                      text-sm
                      "
                  >
                    Permission
                  </th>

                  <th className="
                      p-5
                      text-left
                      font-semibold
                      text-cyan-400
                      uppercase
                      tracking-wide
                      text-sm
                      "
                  >
                    Expiry
                  </th>

                  <th className="
                      p-5
                      text-left
                      font-semibold
                      text-cyan-400
                      uppercase
                      tracking-wide
                      text-sm
                      "
                  >
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center"
                    >
                      Loading...
                    </td>
                  </tr>

                ) : filteredShares.length ===
                  0 ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center"
                    >
                      No Shared Files
                    </td>
                  </tr>

                ) : (

                  filteredShares.map(
                    (share) => (

                      <tr
                        key={
                          share.share_id
                        }
                        className="
                        border-b
                        border-slate-800
                        hover:bg-slate-800/40
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
                              <p className="font-medium text-white">
                                {share.document_title}
                              </p>

                              <p className="text-xs text-slate-500">
                                Shared Document
                              </p>
                            </div>

                          </div>
                        </td>

                        <td className="p-5">
                          <div className="flex items-center gap-3">

                            <div
                              className="
                              w-9
                              h-9
                              rounded-full
                              bg-cyan-500
                              text-black
                              font-bold
                              flex
                              items-center
                              justify-center
                              "
                            >
                              {share.shared_with_name?.charAt(0)}
                            </div>

                            <span>
                              {share.shared_with_name}
                            </span>

                          </div>

                        </td>

                        <td className="p-5">
                          <span
                            className="
                            px-3
                            py-1
                            rounded-full
                            bg-purple-500/20
                            text-purple-400
                            text-sm
                            "
                          >
                            {share.department || "CSE"}
                          </span>
                        </td>

                        <td className="p-4">

                          <span
                            className={`
                            px-4
                            py-1.5
                            rounded-full
                            text-sm
                            font-semibold

                            ${
                              share.permission === "download"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-cyan-500/20 text-cyan-400"
                            }
                          `}
                          >
                            {share.permission}
                          </span>

                        </td>

                        <td className="p-4">
                          {share.expires_at
                            ? new Date(
                                share.expires_at
                              ).toLocaleDateString()
                            : "Never"}
                        </td>

                        <td className="p-4">

                          <button
                            onClick={() =>
                              revokeAccess(
                                share.share_id
                              )
                            }
                            className="
                            px-5
                            py-2
                            rounded-xl
                            bg-red-500
                            hover:bg-red-600
                            transition
                            font-medium
                            text-white
                            shadow-lg
                            "
                          >
                            Revoke
                          </button>

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