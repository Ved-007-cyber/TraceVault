"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";

export default function StudentFilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    setFilteredFiles(
      files.filter((file) =>
        file.document_title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search, files]);

  async function fetchFiles() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("sharelinks")
      .select("*")
      .eq("shared_with_user_id", user.id);

    if (!error && data) {
      setFiles(data);
      setFilteredFiles(data);
    }

    setLoading(false);
  }

  async function handleView(file: any) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        document_id: file.document_id,
        action: "Viewed",
      });
    }

    const { data } = await supabase
      .from("documents")
      .select("file_url")
      .eq("document_id", file.document_id)
      .single();

    if (data?.file_url) {
      window.open(data.file_url, "_blank");
    }
  }

  async function handleDownload(file: any) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("downloads").insert({
      document_id: file.document_id,
      user_id: user.id,
    });

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      document_id: file.document_id,
      action: "Downloaded",
    });

    const { data } = await supabase
      .from("documents")
      .select("file_url")
      .eq("document_id", file.document_id)
      .single();

    if (data?.file_url) {
      window.open(data.file_url, "_blank");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/student-bg.jpg')",
        }}
      />

      <div className="relative z-10 flex min-h-screen">
        <StudentSidebar />

        <main className="flex-1 p-8 text-white">

          <h1 className="text-6xl font-bold">
            Shared Documents
          </h1>

          <p className="text-slate-300 mt-2">
            View files shared by faculty
          </p>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
              w-full h-14
              bg-slate-900/70
              border border-slate-800
              rounded-2xl
              px-5
              py-4
              backdrop-blur-xl
              "
            />
          </div>

          {/* Table */}
          <div
            className="
            bg-slate-900/70
            backdrop-blur-xl
            border border-slate-800
            rounded-1xl
            overflow-hidden
            "
          >
            <table className="w-full">

              <thead>
                <tr className="text-xl h-10 border-b border-slate-800 bg-slate-950/40">

                  <th className="p-5 text-left">
                    Document
                  </th>

                  <th className="p-5 text-left">
                    Faculty
                  </th>

                  <th className="p-5 text-left">
                    Department
                  </th>

                  <th className="p-5 text-left">
                    Permission
                  </th>

                  <th className="p-5 text-left">
                    Actions
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
                ) : filteredFiles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-slate-400"
                    >
                      📄 No Shared Documents Found
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map((file) => (
                    <tr
                      key={file.share_id}
                      className="
                      border-b border-slate-800
                      hover:bg-slate-800/40
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
                            <p className="font-semibold">
                              {file.document_title}
                            </p>

                            <p className="text-xs text-slate-400">
                              {file.document_id}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="p-5">
                        {file.shared_by_name || "-"}
                      </td>

                      <td className="p-5">
                        {file.department || "CSE"}
                      </td>

                      <td className="p-5">
                        <span
                          className="
                          px-3 py-1
                          rounded-1xl
                          bg-cyan-500/20
                          text-cyan-400
                          text-xl
                          "
                        >
                          {file.permission}
                        </span>
                      </td>

                      <td className="p-5">
                        <div className="flex gap-3">

                          <button
                            onClick={() =>
                              handleView(file)
                            }
                            className="
                            px-4 py-2
                            h-8
                            rounded-xl
                            bg-cyan-500
                            text-black
                            font-semibold
                            "
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              handleDownload(file)
                            }
                            className="
                            px-4 py-2
                            rounded-xl
                            bg-green-500
                            text-black
                            font-semibold
                            "
                          >
                            Download
                          </button>

                        </div>
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