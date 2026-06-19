"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classification, setClassification] =
    useState("public");

  const [file, setFile] =
    useState<File | null>(null);

  const [fileKey, setFileKey] = useState(0);

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  async function handleUpload() {
    if (!file || !title) {
      alert(
        "Please enter title and select a file"
      );
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

    const { error: storageError } =
      await supabase.storage
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

    const { error: dbError } =
      await supabase
        .from("documents")
        .insert({
          document_id:
            "DOC-" + Date.now(),

          title,

          description,

          classification,

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
      setSuccessMessage(
        "✅ Document Uploaded Successfully"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setTitle("");
      setDescription("");
      setClassification("public");
      setFile(null);
      setFileKey(
        (prev) => prev + 1
      );
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-950">

      <Sidebar />

      <main
        className="
        flex-1
        min-h-screen
        p-10
        bg-cover
        bg-center
        bg-no-repeat
        overflow-y-auto
        "
        style={{
          backgroundImage:
            "url('/faculty-bg')",
        }}
      >
        {successMessage && (
          <div
            className="
            fixed
            top-6
            right-6
            bg-green-500
            text-black
            px-6
            py-4
            rounded-2xl
            font-semibold
            shadow-xl
            z-50
            "
          >
            {successMessage}
          </div>
        )}

        <div
          className="
          max-w-4xl
          mx-auto
          mt-8
          bg-slate-950/80
          backdrop-blur-md
          border
          border-cyan-500/20
          rounded-xl
          overflow-hidden
          shadow-2xl
          "
        >
          <div
            className="
            p-10

            border-b
            border-slate-800
            "
          >
            <h1
              className="
              text-5xl
              md:text-6xl
              font-extrabold
              text-white
              "
            >
              Upload Document
            </h1>

            <p
              className="
              text-slate-400
              text-lg
              mt-3
              "
            >
              Upload files securely
              into TraceVault
            </p>
          </div>

          <div className="p-10 space-y-8">

            <label
              className="
              h-35
              block
              border-2
              border-dashed
              border-cyan-500
              rounded-3xl
              p-16
              text-center
              cursor-pointer
              hover:bg-cyan-500/5
              transition
              "
            >
              <input
                key={fileKey}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                hidden
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />

              <div className="text-7xl mb-4">
                📄
              </div>

              <h3
                className="
                text-2xl
                font-semibold
                text-white
                "
              >
                {file
                  ? file.name
                  : "Click to Select File"}
              </h3>

              <p
                className="
                text-slate-400
                mt-2
                "
              >
                PDF, DOCX, PPTX
              </p>
            </label>

            <div className="mt-8 space-y-6">

              <input
                type="text"
                placeholder="Document Title"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                className="
                w-full
                h-14
                px-5
                rounded-xl
                bg-slate-800
                border
                border-slate-700
                text-white
                "
              />

              <textarea
                rows={4}
                placeholder="Document Description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="
                w-full
                p-5
                rounded-xl
                bg-slate-800
                border
                border-slate-700
                text-white
                resize-none
                "
              />

              <select
                value={
                  classification
                }
                onChange={(e) =>
                  setClassification(
                    e.target.value
                  )
                }
                className="
                w-full
                h-14
                px-5
                rounded-xl
                bg-slate-800
                border
                border-slate-700
                text-white
                "
              >
                <option value="public">
                  Public
                </option>

                <option value="internal">
                  Internal
                </option>

                <option value="confidential">
                  Confidential
                </option>

                <option value="restricted">
                  Restricted
                </option>
              </select>

              <div className="grid grid-cols-2 gap-6 pt-2">

                <button
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setClassification(
                      "public"
                    );
                    setFile(null);
                    setFileKey(
                      (prev) =>
                        prev + 1
                    );
                  }}
                  className="
                  h-14
                  rounded-xl
                  bg-slate-700
                  text-white
                  font-semibold
                  "
                >
                  Clear
                </button>

                <button
                  onClick={
                    handleUpload
                  }
                  disabled={loading}
                  className="
                  h-14
                  rounded-2xl
                  bg-cyan-500
                  hover:bg-cyan-400
                  text-black
                  font-bold
                  "
                >
                  {loading
                    ? "Uploading..."
                    : "Upload Document"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}