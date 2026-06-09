"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";

export default function StudentFilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

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

  // Save download history
  await supabase.from("downloads").insert({
    document_id: file.document_id,
    user_id: user.id,
  });

  // Save audit log
  await supabase.from("audit_logs").insert({
    user_id: user.id,
    document_id: file.document_id,
    action: "Downloaded",
  });

  // Open file
  if (file.file_url) {
    window.open(file.file_url, "_blank");
  }
}

  return (
    <div className="flex min-h-screen bg-slate-950">
      <StudentSidebar />

      <main className="flex-1 p-10 text-white">
        <h1 className="text-5xl font-bold mb-8">
          Shared Documents
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-slate-900 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-4 text-left">
                    Document
                  </th>

                  <th className="p-4 text-left">
                    Permission
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {files.map((file) => (
                  <tr
                    key={file.share_id}
                    className="border-b border-slate-800"
                  >
                    <td className="p-4">
                      {file.document_title}
                    </td>

                    <td className="p-4">
                      {file.permission}
                    </td>

                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() =>
                          handleView(file)
                        }
                        className="bg-cyan-500 text-black px-4 py-2 rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          handleDownload(file)
                        }
                        className="bg-green-500 text-black px-4 py-2 rounded"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}

                {files.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-6 text-center text-slate-400"
                    >
                      No shared documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}