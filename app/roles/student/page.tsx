"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import StatCard from "@/components/StatCard";
import StudentSidebar from "@/components/StudentSidebar";
import StudentTopbar from "@/components/StudentTopbar";

export default function StudentDashboard() {
  const router = useRouter();

  const [sharedDocs, setSharedDocs] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [activities, setActivities] = useState(0);

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    checkRole();
    loadStats();
  }, []);

  async function checkRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", user.email)
      .single();

    if (profile?.role !== "student") {
      router.push("/");
    }
  }

  async function loadStats() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Shared Documents
    const { count: sharedCount } = await supabase
      .from("sharelinks")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("shared_with_user_id", user.id);

    // Downloads
    const { count: downloadCount } = await supabase
      .from("downloads")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    // Activity
    const { count: activityCount } = await supabase
      .from("audit_logs")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    // Recent Activity
    const { data: activityData } = await supabase
    .from("audit_logs")
    .select(`
      *,
      documents (
        title
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(5);

    setSharedDocs(sharedCount || 0);
    setDownloads(downloadCount || 0);
    setActivities(activityCount || 0);
    setRecentActivity(activityData || []);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage:
            "url('/student-bg.jpg')",
        }}
      />

      <div className="relative z-10 flex min-h-screen">

        <StudentSidebar />

        <main className="flex-1 p-8">

          <StudentTopbar />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

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

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            {/* Recent Activity */}
            <div
              className="
              bg-slate-900/80
              backdrop-blur-xl
              border border-slate-800
              rounded-2xl
              p-6
              "
            >
              <h2 className="
              text-3xl 
              font-bold 
              text-white
              border
              border-slate-600 
              rounded-2xl
              flex
              items-center
              justify-center
              mb-5
              "
              >
                Recent Activity
              </h2>

              <div className="space-y-4">

                {recentActivity.length === 0 ? (

                  <p className="text-slate-400">
                    No Recent Activity
                  </p>

                ) : (

                  recentActivity.map((item, index) => (

                    <div
                      key={index}
                      className="
                      border-b
                      border-slate-400
                      pb-3
                      h-14
                      "
                    >
                      <p className="text-cyan-400 font-semibold">
                        You  {item.action} {"➜  "}
                        <span className="text-white">
                          {item.documents?.title}
                        </span>
                      </p>

                      <p className="text-slate-400 text-lg">
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                  ))

                )}

              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="
              bg-slate-900/80
              backdrop-blur-xl
              border border-slate-800
              rounded-3xl
              p-6
              "
            >
              <h2 className="text-3xl 
              font-bold 
              text-white
              border
              border-slate-600 
              rounded-2xl
              flex
              items-center
              justify-center
              mb-5
              "
              >
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-3">

                <button
                onClick={() => router.push("student/files")}
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
                  src="/icons/share.png"
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
                <span className="
                      h-10
                      font-semibold 
                      text-white 
                      text-xl
                      "
                >
                  Shared Files
                </span>
              </button>

                <button
                  onClick={() => router.push("student/downloads")}
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
                    src="/icons/download.png"
                    alt="Downloads"
                    className="
                    w-20
                    h-20
                    object-contain
                    group-hover:scale-110
                    transition-all
                    duration-300
                    "
                  />
                  <span className="
                      h-10
                      font-semibold 
                      text-white 
                      text-xl
                      "
                  >
                    Downloads
                  </span>
                </button>

                <button
                  onClick={() => router.push("student/activity")}
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
                    src="/icons/activity.png"
                    alt="Activity"
                    className="
                    w-20
                    h-20
                    object-contain
                    group-hover:scale-110
                    transition-all
                    duration-300
                    "
                  />
                  <span className="
                      h-10
                      font-semibold 
                      text-white 
                      text-xl
                      "
                  >
                    Activity
                  </span>
                </button>

                <button
                  onClick={() => router.push("student/profile")}
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
                    src="/icons/profile.png"
                    alt="Profile"
                    className="
                    w-20
                    h-20
                    object-contain
                    group-hover:scale-110
                    transition-all
                    duration-300
                    "
                  />
                  <span className="
                      h-10
                      font-semibold 
                      text-white 
                      text-xl
                      "
                  >
                    Profile
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