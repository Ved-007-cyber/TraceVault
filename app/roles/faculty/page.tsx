"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import ActivityFeed from "@/components/ActivityFeed";
import QuickActions from "@/components/QuickActions";

export default function FacultyDashboard() {
  const [documents, setDocuments] = useState(0);
  const [shares, setShares] = useState(0);
  const [audits, setAudits] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const facultyEmail = "hafreed@tracevault.com";

      const { count: documentCount } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("owner_email", facultyEmail);

      const { count: shareCount } = await supabase
        .from("sharelinks")
        .select("*", { count: "exact", head: true })
        .eq("shared_by_email", facultyEmail);

      const { count: auditCount } = await supabase
        .from("auditlogs")
        .select("*", { count: "exact", head: true })
        .eq("user_email", facultyEmail);

      setDocuments(documentCount || 0);
      setShares(shareCount || 0);
      setAudits(auditCount || 0);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-8">
        <Topbar />

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="My Documents"
            value={documents}
            href="/files"
          />

          <StatCard
            title="Shared Files"
            value={shares}
            href="/share"
          />

          <StatCard
            title="Audit Events"
            value={audits}
            href="/audit"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ActivityFeed />
          <QuickActions />
        </div>
      </main>
    </div>
  );
}