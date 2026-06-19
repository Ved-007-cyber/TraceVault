"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] =
    useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadActivity();
  }, []);

  useEffect(() => {
    let filtered = activities;

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.document_id
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (filter !== "All") {
      filtered = filtered.filter(
        (item) => item.action === filter
      );
    }

    setFilteredActivities(filtered);
  }, [search, filter, activities]);

  async function loadActivity() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error || !logs) {
      setLoading(false);
      return;
    }

    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const { data: doc } = await supabase
          .from("documents")
          .select("title")
          .eq(
            "document_id",
            log.document_id
          )
          .single();

        return {
          ...log,
          title:
            doc?.title ||
            log.document_id,
        };
      })
    );

    setActivities(enrichedLogs);
    setFilteredActivities(
      enrichedLogs
    );
    setLoading(false);
  }

  function getActionColor(
    action: string
  ) {
    switch (action) {
      case "Viewed":
        return "bg-cyan-500/20 text-cyan-300";

      case "Downloaded":
        return "bg-green-500/20 text-green-300";

      case "Shared":
        return "bg-yellow-500/20 text-yellow-300";

      default:
        return "bg-slate-700 text-slate-300";
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/student-bg.jpg')",
        }}
      />

      <div className="relative z-10 flex min-h-screen">

        <StudentSidebar />

        <main className="flex-1 p-8 text-white">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold">
              Activity History
            </h1>

            <p className="text-slate-400 mt-2">
              Track all your document
              activities
            </p>
          </div>

          {/* Search + Filter */}
          <div
            className="
            backdrop-blur-xl
            
            rounded-3xl
            p-6
            mb-6
            "
          >
            <div className="flex flex-col md:flex-row gap-4">

              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="
                flex-1
                h-14
                bg-slate-800
                border border-slate-700
                rounded-xl
                px-5
                py-4
                outline-none
                "
              />

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value
                  )
                }
                className="
                bg-slate-800
                border border-slate-700
                rounded-xl
                px-5
                py-4
                "
              >
                <option>
                  All
                </option>

                <option>
                  Viewed
                </option>

                <option>
                  Downloaded
                </option>

                <option>
                  Shared
                </option>
              </select>

            </div>
          </div>

          {/* Table */}
          <div
            className="
            bg-slate-900/80
            backdrop-blur-xl
            border border-slate-800
            rounded-1xl
            overflow-hidden
            "
          >
            <table className="w-full">

              <thead>
                <tr className="h-10 text-xl border-b border-slate-800">
                  <th className="p-5 text-left">
                    Document
                  </th>

                  <th className="p-5 text-left">
                    Action
                  </th>

                  <th className="p-5 text-left">
                    Date
                  </th>

                  <th className="p-5 text-left">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredActivities.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-slate-400"
                    >
                      No Activity Found
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map(
                    (item) => (
                      <tr
                        key={
                          item.audit_id
                        }
                        className="
                        border-b
                        border-slate-600
                        hover:bg-slate-800/30
                        transition
                        "
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                              w-12 h-12
                              rounded-xl
                              bg-cyan-900/50
                              flex items-center justify-center
                              "
                            >
                              📄
                            </div>

                            <div>
                              <p className="text-xl font-semibold">
                                {
                                  item.title
                                }
                              </p>
                              <p className="text-xs bg-slate-800">
                                {
                                  item.document_id
                                }
                              </p>

                            </div>
                          </div>

                        </td>

                        <td className="p-5">

                          <span
                            className={`
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium
                            ${getActionColor(
                              item.action
                            )}
                            `}
                          >
                            {
                              item.action
                            }
                          </span>

                        </td>

                        <td className="p-5 text-lg text-red-400 ">
                          {new Date(
                            item.created_at
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-5 text-lg text-yellow-400">
                          {new Date(
                            item.created_at
                          ).toLocaleTimeString()}
                        </td>
                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>
          </div>

        </main>
      </div>
    </div>
  );
}