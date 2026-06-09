"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
  if (!file || !title) {
    alert("Enter title and select file");
    return;
  }

  setLoading(true);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Login required");
    setLoading(false);
    return;
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(fileName, file);

  if (storageError) {
    alert(storageError.message);
    setLoading(false);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("documents")
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase
    .from("documents")
    .insert({
      document_id: "DOC-" + Date.now(),
      title: title,
      file_url: publicUrl,
      file_type: file.name
        .split(".")
        .pop()
        ?.toLowerCase(),

      owner_id: user.id,

      storage_path: fileName,
    });

  if (dbError) {
    alert(dbError.message);
  } else {
    alert("Document Uploaded Successfully");
    setTitle("");
    setFile(null);
    setFileKey((prev)=> prev +1 );
  }

  setLoading(false);
}

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-10 text-white">
        <h1 className="text-5xl font-bold mb-8">
          Upload Document
        </h1>

        <div className="bg-slate-900 p-8 rounded-xl max-w-xl">

          <input
            type="text"
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 mb-4"
          />

          <input
            key={fileKey}
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="w-full mb-6"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-cyan-500 text-black px-6 py-3 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

        </div>
      </main>
    </div>
  );
}