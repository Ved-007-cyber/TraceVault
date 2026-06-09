"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Document {
  document_id: string;
  title: string;
  file_type: string;
  file_size: number;
  file_url: string;
  owner_email: string;
}

export default function FilesPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredDocs(filtered);
  }, [search, documents]);

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDocuments(data);
      setFilteredDocs(data);
    }
  }

  async function deleteDocument(doc: Document) {
    const confirmDelete = confirm(
      `Delete ${doc.title}?`
    );

    if (!confirmDelete) return;

    const path = doc.file_url.split("/documents/")[1];

    await supabase.storage
      .from("documents")
      .remove([path]);

    await supabase
      .from("documents")
      .delete()
      .eq("document_id", doc.document_id);

    await supabase.from("auditlogs").insert([
      {
        action: "delete",
        document_id: doc.document_id,
        document_title: doc.title,
        user_email: "hafreed@tracevault.com",
        user_name: "Hafreed",
        user_role: "faculty",
        details: `Deleted ${doc.title}`,
        entry_hash: crypto.randomUUID()
      }
    ]);

    fetchDocuments();
  }

  async function shareDocument(doc: Document) {
    const email = prompt(
      "Enter recipient email"
    );

    if (!email) return;

    await supabase.from("sharelinks").insert([
      {
        document_id: doc.document_id,
        document_title: doc.title,

        shared_with_email: email,
        shared_with_name: email,

        shared_by_email:
          "hafreed@tracevault.com",

        shared_by_name: "Hafreed",

        permission: "view",

        status: "active"
      }
    ]);

    await supabase.from("auditlogs").insert([
      {
        action: "share",
        document_id: doc.document_id,
        document_title: doc.title,
        user_email: "hafreed@tracevault.com",
        user_name: "Hafreed",
        user_role: "faculty",
        details: `Shared ${doc.title} with ${email}`,
        entry_hash: crypto.randomUUID()
      }
    ]);

    alert("File Shared");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        Documents
      </h1>

      <input
        type="text"
        placeholder="Search Documents..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full p-4 rounded-lg bg-slate-900 mb-8"
      />

      <div className="bg-slate-900 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-800">
              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Size
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredDocs.map((doc) => (
              <tr
                key={doc.document_id}
                className="border-b border-slate-800"
              >
                <td className="p-4">
                  {doc.title}
                </td>

                <td className="p-4 uppercase">
                  {doc.file_type}
                </td>

                <td className="p-4">
                  {(doc.file_size / 1024).toFixed(1)}
                  KB
                </td>

                <td className="p-4 flex gap-2">

                  <a
                    href={doc.file_url}
                    target="_blank"
                    className="bg-cyan-500 px-3 py-1 rounded"
                  >
                    View
                  </a>

                  <a
                    href={doc.file_url}
                    download
                    className="bg-green-500 px-3 py-1 rounded"
                  >
                    Download
                  </a>

                  <button
                    onClick={() =>
                      shareDocument(doc)
                    }
                    className="bg-yellow-500 px-3 py-1 rounded"
                  >
                    Share
                  </button>

                  <button
                    onClick={() =>
                      deleteDocument(doc)
                    }
                    className="bg-red-500 px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}