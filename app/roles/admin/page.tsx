"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import StatCard from "@/components/StatCard";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();

  const [students, setStudents] = useState(0);
  const [faculty, setFaculty] = useState(0);
  const [documents, setDocuments] = useState(0);
  const [shares, setShares] = useState(0);
  const [audits, setAudits] = useState(0);
  const [activeUsers, setActiveUsers] =
    useState(0);

  const [activities, setActivities] =
    useState<any[]>([]);

  useEffect(() => {
    checkRole();
    loadDashboard();
  }, []);

  async function checkRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", user.email)
      .single();

    if (data?.role !== "admin") {
      router.push("/");
    }
  }

  async function loadDashboard() {
    await loadStats();
    await loadRecentActivity();
  }

  async function loadStats() {
    const { count: studentCount } =
      await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "student");

    const { count: facultyCount } =
      await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("role", "faculty");

    const { count: documentCount } =
      await supabase
        .from("documents")
        .select("*", {
          count: "exact",
          head: true,
        });

    const { count: shareCount } =
      await supabase
        .from("sharelinks")
        .select("*", {
          count: "exact",
          head: true,
        });

    const { count: auditCount } =
      await supabase
        .from("audit_logs")
        .select("*", {
          count: "exact",
          head: true,
        });

    setStudents(studentCount || 0);
    setFaculty(facultyCount || 0);
    setDocuments(documentCount || 0);
    setShares(shareCount || 0);
    setAudits(auditCount || 0);

    setActiveUsers(
      (studentCount || 0) +
        (facultyCount || 0)
    );
  }

  async function loadRecentActivity() {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (error || !data) return;

    const enrichedActivities = await Promise.all(
      data.map(async (activity) => {
        const { data: profile } =
          await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", activity.user_id)
            .single();

        return {
          ...activity,
          userName:
            profile?.full_name ||
            "Unknown User",
        };
      })
    );
    console.log(enrichedActivities);
    setActivities(enrichedActivities);
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
          "url('/admin-bg.jpg')",
      }}
    />
    {/* Dashboard Content */}

    <div className="relative z-10 flex min-h-screen">

      <AdminSidebar />

      <main className="flex-1 px-12 py-10">

        {/* Header */}

        <div className="mb-10">

          <h1 className="
              text-7xl
              font-extrabold
              text-white
              leading-none
              ">
            Welcome Back,
          </h1>

          <p className="text-4xl text-cyan-400 front-semibold mt-3">
            Administrator
          </p>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-3 gap-8 mb-12 ">

          <StatCard
            title="👨‍🎓 Students"
            value={students}
            href="/roles/admin/users"
          />

          <StatCard
            title="🧑‍🏫 Faculty"
            value={faculty}
            href="/roles/admin/users"
          />

          <StatCard
            title="📄 Documents"
            value={documents}
            href="/roles/admin/documents"
          />

          <StatCard
            title="🔗 Shared Files"
            value={shares}
            href="/roles/admin/shares"
          />

          <StatCard
            title="📜 Audit Logs"
            value={audits}
            href="/roles/admin/audit"
          />

          <StatCard
            title="🟢 Active Users"
            value={activeUsers}
            href="/roles/admin/users"
          />

        </div>
                {/* Bottom Section */}

        <div className="grid grid-cols-12 gap-8 h-[360px]">

          {/* Recent Activity */}

          <div
            className="
            col-span-8
            h-[320px]

            bg-slate-900/80

            border
            border-slate-800

            rounded-2xl

            p-6

            flex
            flex-col

            h-[320px]
            "
          >
            <h2 className="text-3xl font-bold text-white border border-slate-800 rounded-xl mb-5">
              Recent Activity
            </h2>

            <div className="flex-1 space-y-2 overflow-y-auto pr-2">

              {activities.length === 0 ? (
                <div className="text-slate-400">
                  No Recent Activity
                </div>
              ) : (
                activities.map(
                  (activity: any) => (
                    <div
                      key={activity.audit_id}
                      className="
                      h-14
                      rounded-xl
                      p-4
                      transition
                      "
                    >
                      <p className="text-white tect-lg">

                        <span className="text-cyan-400 font-bold">
                          {activity.userName}
                        </span>

                        {" "}

                        {activity.action}

                      </p>

                      <p className="text-slate-400 text-base text-lg">
                        {new Date(
                          activity.created_at
                        ).toLocaleString()}
                      </p>

                    </div>
                  )
                )
              )}

            </div>

          </div>

          {/* Quick Actions */}

          <div
            className="
            col-span-4

            bg-slate-900/80

            border
            border-slate-800

            rounded-xl

            p-5

            flex
            flex-col
            h-[320px]
            "
          >
            <h2 className="text-3xl font-bold border border-slate-800 rounded-xl text-white mb-5">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={() => router.push("/roles/admin/users")}
                className="
                  bg-cyan-900/70
                  backdrop-blur-md
                  border border-cyan-500/20

                  hover:bg-cyan-400
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]

                  rounded-2xl

                  flex
                  flex-col
                  items-center
                  justify-center

                  h-full
                  w-full

                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  group
                  "
              >
                <img
                  src="/icons/add_user.jpg"
                  alt="Add User"
                  className="
                  w-20
                  h-20
                  object-contain
                  group-hover:scale-110
                  transition-all
                  duration-300
                  "
                />
                <span className="font-semibold text-black text-lg">
                  Add User
                </span>
              </button>

              <button
                onClick={() => router.push("/roles/admin/documents")}
                className="
                  bg-cyan-900/70
                  backdrop-blur-md
                  border border-cyan-500/20

                  hover:bg-cyan-400
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]

                  rounded-2xl

                  flex
                  flex-col
                  items-center
                  justify-center

                  h-full
                  w-full

                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  group
                  "
              >
                <img
                  src="/icons/Doc_image.png"
                  alt="Documents"
                  className="
                  w-20
                  h-20
                  object-contain
                  group-hover:scale-110
                  transition-all
                  duration-300
                  "
                />
                <span className="font-semibold text-black text-lg">
                  Documents
                </span>
              </button>

              <button
                onClick={() => router.push("/roles/admin/shared")}
                className="
                  bg-cyan-900/70
                  backdrop-blur-md
                  border border-cyan-500/20

                  hover:bg-cyan-400
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]

                  rounded-2xl

                  flex
                  flex-col
                  items-center
                  justify-center

                  h-full
                  w-full

                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  group
                  "
              >
                <img
                  src="/icons/shared_link_image.jpg"
                  alt="Shared Files"
                  className="
                  w-20
                  h-20
                  object-contain
                  group-hover:scale-110
                  transition-all
                  duration-300
                  "
                />
                <span className="font-semibold text-black text-lg">
                  Shared Files
                </span>
              </button>

              <button
                onClick={() => router.push("/roles/admin/audit")}
                className="
                  bg-cyan-900/70
                  backdrop-blur-md
                  border border-cyan-500/20

                  hover:bg-cyan-400
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]

                  rounded-2xl

                  flex
                  flex-col
                  items-center
                  justify-center

                  h-full
                  w-full

                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  group
                  "
              >
                <img
                  src="/icons/audit_log_image.jpg"
                  alt="Audit Logs"
                  className="
                  w-20
                  h-20
                  object-contain
                  group-hover:scale-110
                  transition-all
                  duration-300
                  "
                />
                <span className="font-semibold text-black text-lg">
                  Audit Logs
                </span>
              </button>

            </div>
          </div>

        </div>

      </main>

    </div>
    </div>
  );
}