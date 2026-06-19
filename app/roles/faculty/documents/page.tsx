"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function FacultyDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("owner_email", user.email)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      setDocuments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDocument(doc: any) {
    const confirmDelete = window.confirm(
      "Delete this document?"
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("document_id", doc.document_id);

      if (error) {
        alert(error.message);
        return;
      }

      setDocuments((prev) =>
        prev.filter(
          (d) => d.document_id !== doc.document_id
        )
      );

      alert("Document deleted successfully");
    } catch (err) {
      console.error(err);
    }
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      doc.document_id
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/faculty-bg.jpg')",
        }}
      />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-10 text-white">

          {/* Header */}

          <div className="mb-8">
            <h1 className="text-6xl font-bold">
              My Documents
            </h1>

            <p className="text-slate-300 text-lg mt-2">
              Manage your uploaded files
            </p>
          </div>

          {/* Search */}

          <input
            type="text"
            placeholder="Search Documents..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
            w-full
            h-14
            mb-8
            px-5
            rounded-2xl
            bg-slate-900/70
            border
            border-slate-700
            text-white
            focus:outline-none
            focus:border-cyan-400
            "
          />

          {/* Table */}

          <div
            className="
            bg-slate-900/70
            backdrop-blur-md
            border
            border-slate-800
            rounded-3xl
            overflow-hidden
            "
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-4 text-left">
                    Document
                  </th>

                  <th className="p-4 text-left">
                    Type
                  </th>

                  <th className="p-4 text-left">
                    Classification
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredDocuments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center"
                    >
                      No Documents Found
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr
                      key={doc.document_id}
                      className="border-b border-slate-800"
                    >
                      <td className="p-4">
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
                              {doc.title}
                            </p>

                            <p className="text-xs text-slate-400">
                              {doc.document_id}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-red-400">
                          {doc.file_type}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className="
                          px-3
                          py-1
                          rounded-full
                          bg-cyan-500/20
                          text-cyan-400
                          text-sm
                          "
                        >
                          {doc.classification}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">

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
                            rounded-xl
                            bg-cyan-500
                            text-black
                            font-semibold
                            "
                          >
                            View
                          </button>

                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                            px-4
                            py-2
                            rounded-xl
                            bg-green-500
                            text-black
                            font-semibold
                            "
                          >
                            Download
                          </a>

                          <button
                            className="
                            px-4
                            py-2
                            rounded-xl
                            bg-yellow-500
                            text-black
                            font-semibold
                            "
                          >
                            Share
                          </button>

                          <button
                            onClick={() =>
                              deleteDocument(doc)
                            }
                            className="
                            px-4
                            py-2
                            rounded-xl
                            bg-red-500
                            text-white
                            font-semibold
                            "
                          >
                            Delete
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