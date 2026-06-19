"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [filteredDownloads, setFilteredDownloads] =
    useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDownloads();
  }, []);

  useEffect(() => {
    const filtered = downloads.filter(
      (item) =>
        item.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.fileType
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredDownloads(filtered);
  }, [search, downloads]);

  async function loadDownloads() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: downloadsData, error } =
      await supabase
        .from("downloads")
        .select("*")
        .eq("user_id", user.id)
        .order("downloaded_at", {
          ascending: false,
        });

    if (error || !downloadsData) {
      setLoading(false);
      return;
    }

    const enrichedData = await Promise.all(
      downloadsData.map(async (item) => {
        const { data: doc } = await supabase
          .from("documents")
          .select(
            "title,file_type,file_url,department"
          )
          .eq("document_id", item.document_id)
          .single();

        return {
          ...item,
          title:
            doc?.title ||
            item.document_id,
          fileType:
            doc?.file_type || "pdf",
          fileUrl:
            doc?.file_url || "",
          department:
            doc?.department || "-",
        };
      })
    );

    setDownloads(enrichedData);
    setFilteredDownloads(enrichedData);
    setLoading(false);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/student-bg.jpg')",
        }}
      />

      <div className="relative z-10 flex min-h-screen">

        <StudentSidebar />

        <main className="flex-1 p-8 text-white">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold">
              Downloads
            </h1>

            <p className="text-slate-400 mt-2">
              View and manage your
              downloaded files
            </p>
          </div>

          {/* Search */}
          <div
            className="
            bg-slate-900/80
            backdrop-blur-xl
            border border-slate-800
            rounded-2xl
            p-6
            mb-6
            "
          >
            <input
              type="text"
              placeholder="Search downloads..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
              w-full
              h-14
              bg-slate-800
              border border-slate-700
              rounded-xl
              px-5
              py-4
              outline-none
              "
            />
          </div>

          {/* Table */}
          <div
            className="

            bg-slate-900/80
            backdrop-blur-xl
            border border-slate-800
            rounded-1xl
            overflow-hidden
            "
          >
            <table className="w-full">

              <thead>
                <tr className="h-10 border-b border-slate-400 text-xl text-left">
                  <th className="p-5">
                    Document
                  </th>

                  <th className="p-5">
                    Type
                  </th>

                  <th className="p-5">
                    Downloaded
                  </th>

                  <th className="p-5">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredDownloads.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-400"
                    >
                      No downloads found
                    </td>
                  </tr>
                ) : (
                  filteredDownloads.map(
                    (item) => (
                      <tr
                        key={
                          item.download_id
                        }
                        className="
                        border-b
                        border-slate-600
                        hover:bg-slate-800/30
                        transition
                        "
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                           <div
                            className="
                            w-12 h-12
                            rounded-xl
                            bg-cyan-900/50
                            flex items-center justify-center
                            "
                          >
                            📄
                          </div>

                          <div>
                            <p className="text-xl font-semibold">
                              {
                                item.title
                              }
                            </p>
                            <p className="text-xs bg-slate-800">
                              {
                                item.document_id
                              }
                            </p>

                          </div>
                          </div>
                        </td>

                        <td className="p-5">
                          <span
                            className="
                            px-3
                            py-1
                            rounded-full
                            bg-cyan-500/20
                            text-cyan-300
                            text-sm
                            uppercase
                            "
                          >
                            {
                              item.fileType
                            }
                          </span>
                        </td>

                        <td className="p-5 text-slate-400">
                          {new Date(
                            item.downloaded_at
                          ).toLocaleString()}
                        </td>

                        <td className="p-5">
                          <button
                            onClick={() =>
                              window.open(
                                item.fileUrl,
                                "_blank"
                              )
                            }
                            className="
                            bg-cyan-500
                            hover:bg-cyan-400
                            text-black
                            px-4
                            py-2
                            rounded-lg
                            font-semibold
                            "
                          >
                            View
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