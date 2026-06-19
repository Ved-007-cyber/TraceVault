"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import ActivityFeed from "@/components/ActivityFeed";
import QuickActions from "@/components/QuickActions";

export default function FacultyDashboard() {
  const router = useRouter();

  const [documents, setDocuments] = useState(0);
  const [shares, setShares] = useState(0);
  const [audits, setAudits] = useState(0);
  const [studentsReached, setStudentsReached] =
    useState(0);

  const [facultyEmail, setFacultyEmail] =
    useState("");

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .single();

    if (!profile || profile.role !== "faculty") {
      router.push("/");
      return;
    }

    setFacultyEmail(profile.email);

    fetchDashboardData(profile.email);
  }

  async function fetchDashboardData(
    email: string
  ) {
    try {
      // My Documents
      const { count: documentCount } =
        await supabase
          .from("documents")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("owner_email", email);

      // Shared Files
      const { count: shareCount } =
        await supabase
          .from("sharelinks")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("shared_by_email", email);

      // Audit Events
      const { count: auditCount } =
        await supabase
          .from("audit_logs")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_email", email);

      // Students Reached
      const { data: studentShares } =
        await supabase
          .from("sharelinks")
          .select("shared_with_email")
          .eq("shared_by_email", email);

      const uniqueStudents = [
        ...new Set(
          studentShares?.map(
            (s) => s.shared_with_email
          )
        ),
      ];

      setDocuments(documentCount || 0);
      setShares(shareCount || 0);
      setAudits(auditCount || 0);
      setStudentsReached(
        uniqueStudents.length || 0
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

    {/* Background Image */}

    <div
      className="
      absolute
      inset-0
      bg-cover
      bg-center
      bg-no-repeat
      "
      style={{
        backgroundImage:
          "url('/faculty-bg')",
      }}
    />
    <div
    className="
      absolute
      inset-0
      bg-gradient-to-r
      from-slate-950/40
      via-slate-950/10
      to-slate-950/40
    "
  />
    {/* Dashboard Content */}

    <div className="relative z-10 flex min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8">

        <Topbar />

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-8
        whitespace-pre"
        style={{tabSize:1}}>

          <StatCard 
            title="My Documents"
            value={documents}
            href="/roles/faculty/documents"
          />

          <StatCard
            title="Shared Files"
            value={shares}
            href="/roles/faculty/shared"
          />

          <StatCard
            title="Audit Events"
            value={audits}
            href="/roles/faculty/audit"
          />

          <StatCard
            title="Students Reached"
            value={studentsReached}
          />

        </div>

        {/* Content */}

        <div className="grid lg:grid-cols-2 gap-6">

          <ActivityFeed />

          <QuickActions />

        </div>

      </main>
      </div>
    </div>
  );
}