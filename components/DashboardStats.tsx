"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    documents: 0,
    sharedFiles: 0,
    auditLogs: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    loadStats();

    const channel = supabase
      .channel("dashboard-stats")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => loadStats()
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
        },
        () => loadStats()
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sharelinks",
        },
        () => loadStats()
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auditlogs",
        },
        () => loadStats()
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadStats() {
    const { count: students } =
      await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "student");

    const { count: faculty } =
      await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "faculty");

    const { count: documents } =
      await supabase
        .from("documents")
        .select("*", {
          count: "exact",
          head: true,
        });

    const { count: sharedFiles } =
      await supabase
        .from("sharelinks")
        .select("*", {
          count: "exact",
          head: true,
        });

    const { count: auditLogs } =
      await supabase
        .from("auditlogs")
        .select("*", {
          count: "exact",
          head: true,
        });

    setStats({
      students: students || 0,
      faculty: faculty || 0,
      documents: documents || 0,
      sharedFiles: sharedFiles || 0,
      auditLogs: auditLogs || 0,
      activeUsers:
        (students || 0) +
        (faculty || 0),
    });
  }

  return (
    <div className="grid grid-cols-3 gap-6">

      <Card
        title="👨‍🎓 Students"
        value={stats.students}
      />

      <Card
        title="👨‍🏫 Faculty"
        value={stats.faculty}
      />

      <Card
        title="📄 Documents"
        value={stats.documents}
      />

      <Card
        title="🔗 Shared Files"
        value={stats.sharedFiles}
      />

      <Card
        title="📋 Audit Logs"
        value={stats.auditLogs}
      />

      <Card
        title="🟢 Active Users"
        value={stats.activeUsers}
      />

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      className="
      bg-slate-900
      rounded-3xl
      p-6
      border
      border-slate-800
      hover:border-cyan-400
      hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]
      transition
      "
    >
      <p className="text-slate-400 text-lg">
        {title}
      </p>

      <h1 className="text-5xl font-bold text-white mt-3">
        {value}
      </h1>
    </div>
  );
}