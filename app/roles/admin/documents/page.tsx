"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const docsWithOwner = await Promise.all(
        data.map(async (doc) => {
          if (!doc.owner_id) {
            return {
              ...doc,
              owner_name: "Unknown",
            };
          }

          const { data: owner } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", doc.owner_id)
            .single();

          return {
            ...doc,
            owner_name:
              owner?.full_name || "Unknown",
          };
        })
      );

      setDocuments(docsWithOwner);
    }

    setLoading(false);
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      doc.file_type
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      doc.owner_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  async function deleteDocument(doc: any) {
  const confirmDelete = confirm(
    `Delete "${doc.title}" ?`
  );

  if (!confirmDelete) return;

  try {
    // Delete physical file
    if (doc.storage_path) {
      const { error: storageError } =
        await supabase.storage
          .from("documents")
          .remove([doc.storage_path]);

      if (storageError) {
        console.error(storageError);
      }
    }

    // Delete related records
    await supabase
      .from("sharelinks")
      .delete()
      .eq("document_id", doc.document_id);

    await supabase
      .from("downloads")
      .delete()
      .eq("document_id", doc.document_id);

    await supabase
      .from("audit_logs")
      .delete()
      .eq("document_id", doc.document_id);

    // Delete document row
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("document_id", doc.document_id);

    if (error) throw error;

    setDocuments((prev) =>
      prev.filter(
        (d) => d.document_id !== doc.document_id
      )
    );

    toast.success("Document deleted");
  } catch (err: any) {
    console.error(err);
    toast.error(err.message);
  }
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
              Documents Management
            </h1>

            <p className="text-white text-slate-400 mt-2 text-lg">
              Manage uploaded files across TraceVault
            </p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            mb-8
            h-14
            px-5
            rounded-xl
            bg-slate-900/70
            backdrop-blur-md
            text-white
            border
            border-slate-700
            focus:border-cyan-400
            focus:outline-none
            transition
          "
        />

        <div className=" bg-slate-900/70

          backdrop-blur-md

          border
          border-slate-800

          rounded-1xl

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
                  Title
                </th>

                <th className="px-6 py-5 text-left">
                  Type
                </th>

                <th className="px-6 py-5 text-left">
                  Owner
                </th>

                <th className="px-6 py-5 text-center">
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
              ) : filteredDocuments.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center"
                  >
                    No Documents Found
                  </td>
                </tr>
              ) : (
                filteredDocuments.map(
                  (doc) => (
                    <tr
                      key={doc.document_id}
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

                          <div>

                            <p className="font-semibold">
                              {doc.document_id}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="p-4">
                        {doc.title}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className="
                          px-3
                          py-1

                          rounded-full

                          bg-red-500/20

                          text-red-400

                          text-sm

                          font-medium
                          "
                        >
                          {doc.file_type.toUpperCase()}
                        </span>
                    </td>

                      <td className="p-4">
                        {doc.owner_name}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() =>
                              window.open(
                                doc.file_url,
                                "_blank"
                              )
                            }
                            className="
                            px-4
                            py-2

                            rounded-lg

                            bg-cyan-500
                            hover:bg-cyan-400

                            text-black
                            font-semibold

                            transition
                            "
                          >
                            View
                          </button>
                          <a
                            href={doc.file_url}
                 
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                            px-4
                            py-2

                            rounded-lg

                            bg-green-500
                            hover:bg-green-600

                            text-white
                            font-semibold

                            transition
                            "
                          >
                            Download
                          </a>

                          <button
                            onClick={() =>
                              deleteDocument(doc)
                            }
                            className="
                            px-4
                            py-2

                            rounded-lg

                            bg-red-500
                            hover:bg-red-600

                            text-white
                            font-semibold

                            transition
                            "
                          >
                            Delete
                          </button>

                        </div>

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