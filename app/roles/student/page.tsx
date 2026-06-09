"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import StatCard from "@/components/StatCard";
import StudentSidebar from "@/components/StudentSidebar";
import StudentTopbar from "@/components/StudentTopbar";

export default function StudentDashboard() {

  const [sharedDocs, setSharedDocs] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [activities, setActivities] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { count: sharedCount } = await supabase
      .from("sharelinks")
      .select("*", { count: "exact", head: true })
      .eq("shared_with_user_id", user.id);

    const { count: activityCount } = await supabase
      .from("auditlogs")
      .select("*", { count: "exact", head: true })
      .eq("user_email", user.email);

    setSharedDocs(sharedCount || 0);
    setActivities(activityCount || 0);
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <StudentTopbar />

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <StatCard
            title="Shared Documents"
            value={sharedDocs}
            href="/student/files"
          />

          <StatCard
            title="Downloads"
            value={downloads}
            href="/student/downloads"
          />

          <StatCard
            title="Activity"
            value={activities}
            href="/student/activity"
          />

        </div>
      </main>
    </div>
  );
}