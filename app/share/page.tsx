"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function SharePage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [selectedDoc, setSelectedDoc] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    loadDocuments();
    loadStudents();
  }, []);

  async function loadDocuments() {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setDocuments(data);
    }
  }

  async function loadStudents() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student");

    if (data) {
      setStudents(data);
    }
  }

  async function handleShare() {
    if (!selectedDoc || !selectedStudent) {
      alert("Select document and student");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login required");
      return;
    }

    const document = documents.find(
      (d) => d.document_id === selectedDoc
    );

    const student = students.find(
      (s) => s.id === selectedStudent
    );

    if (!document || !student) {
      alert("Invalid selection");
      return;
    }

    const { data: faculty } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: existing } = await supabase
      .from("sharelinks")
      .select("*")
      .eq("document_id", document.document_id)
      .eq("shared_with_user_id", student.id)
      .maybeSingle();

    if (existing) {
      alert("Document already shared with this student");
      return;
    }

    // Create Share Record
    const { error } = await supabase
      .from("sharelinks")
      .insert({
        document_id: document.document_id,
        document_title: document.title,

        shared_with_user_id: student.id,
        shared_with_email: student.email,
        shared_with_name: student.full_name,

        shared_by_email: faculty?.email,
        shared_by_name: faculty?.full_name,

        permission: "view",
        status: "active",
        access_count: 0,
      });

    if (error) {
      alert(error.message);
      return;
    }

    // Create Audit Log
    const { error: auditError } = await supabase
      .from("audit_logs")
      .insert({
        user_id: user.id,
        document_id: document.document_id,
        action: "Shared",
      });

    console.log("AUDIT INSERT ERROR:", auditError);

    if (auditError) {
      alert(auditError.message);
    } else {
      alert("Document Shared Successfully");
    }

    setSelectedDoc("");
    setSelectedStudent("");
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-10 text-white">
        <h1 className="text-5xl font-bold mb-8">
          Share Document
        </h1>

        <div className="bg-slate-900 p-8 rounded-xl max-w-2xl">

          <label className="block mb-2">
            Select Document
          </label>

          <select
            className="w-full p-3 rounded bg-slate-800 mb-6"
            value={selectedDoc}
            onChange={(e) =>
              setSelectedDoc(e.target.value)
            }
          >
            <option value="">
              Choose Document
            </option>

            {documents.map((doc) => (
              <option
                key={doc.document_id}
                value={doc.document_id}
              >
                {doc.title}
              </option>
            ))}
          </select>

          <label className="block mb-2">
            Select Student
          </label>

          <select
            className="w-full p-3 rounded bg-slate-800 mb-6"
            value={selectedStudent}
            onChange={(e) =>
              setSelectedStudent(e.target.value)
            }
          >
            <option value="">
              Choose Student
            </option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.full_name}
              </option>
            ))}
          </select>

          <button
            onClick={handleShare}
            className="bg-cyan-500 text-black px-6 py-3 rounded-lg hover:bg-cyan-400"
          >
            Share
          </button>

        </div>
      </main>
    </div>
  );
}