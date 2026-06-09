"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

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

  async function deleteDocument(
    documentId: string
  ) {
    const confirmDelete = confirm(
      "Delete this document?"
    );

    if (!confirmDelete) return;

    try {
      await supabase
        .from("sharelinks")
        .delete()
        .eq("document_id", documentId);

      await supabase
        .from("audit_logs")
        .delete()
        .eq("document_id", documentId);

      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("document_id", documentId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Document Deleted");

      loadDocuments();
    } catch (err) {
      console.error(err);
      alert("Delete Failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-10 text-white">
        <h1 className="text-5xl font-bold mb-8">
          Documents Management
        </h1>

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            mb-6
            p-3
            rounded-xl
            bg-slate-800
            text-white
            border
            border-slate-700
          "
        />

        <div className="bg-slate-900 rounded-xl overflow-hidden">
          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-800">

                <th className="p-4 text-left">
                  Document ID
                </th>

                <th className="p-4 text-left">
                  Title
                </th>

                <th className="p-4 text-left">
                  File Type
                </th>

                <th className="p-4 text-left">
                  Owner
                </th>

                <th className="p-4 text-left">
                  Action
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
                      <td className="p-4">
                        {doc.document_id}
                      </td>

                      <td className="p-4">
                        {doc.title}
                      </td>

                      <td className="p-4">
                        {doc.file_type}
                      </td>

                      <td className="p-4">
                        {doc.owner_name}
                      </td>

                      <td className="p-4">

                        <button
                          onClick={() =>
                            window.open(
                              doc.file_url,
                              "_blank"
                            )
                          }
                          className="bg-cyan-500 text-black px-3 py-2 rounded mr-2"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            deleteDocument(
                              doc.document_id
                            )
                          }
                          className="bg-red-500 text-white px-3 py-2 rounded"
                        >
                          Delete
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
  );
}