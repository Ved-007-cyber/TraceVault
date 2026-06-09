"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import StatCard from "@/components/StatCard";

export default function AdminDashboard() {
  const [students, setStudents] = useState(0);
  const [faculty, setFaculty] = useState(0);
  const [documents, setDocuments] = useState(0);
  const [shares, setShares] = useState(0);
  const [audits, setAudits] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { count: studentCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    const { count: facultyCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "faculty");

    const { count: documentCount } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true });

    const { count: shareCount } = await supabase
      .from("sharelinks")
      .select("*", { count: "exact", head: true });

    const { count: auditCount } = await supabase
      .from("audit_logs")
      .select("*", { count: "exact", head: true });

    setStudents(studentCount || 0);
    setFaculty(facultyCount || 0);
    setDocuments(documentCount || 0);
    setShares(shareCount || 0);
    setAudits(auditCount || 0);
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-5xl text-white font-bold mb-8">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">

          <StatCard
            title="Students"
            value={students}
            href="/roles/admin/users"
          />

          <StatCard
            title="Faculty"
            value={faculty}
            href="/roles/admin/users"
          />

          <StatCard
            title="Documents"
            value={documents}
            href="/roles/admin/documents"
          />

          <StatCard
            title="Shared Files"
            value={shares}
            href="/roles/admin/shares"
          />

          <StatCard
            title="Audit Logs"
            value={audits}
            href="/roles/admin/audit"
          />

        </div>
      </main>
    </div>
  );
}