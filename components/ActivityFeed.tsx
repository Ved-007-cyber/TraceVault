"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    const { data } = await supabase
      .from("auditlogs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) setActivities(data);
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <h2 className="text-3xl font-bold text-white mb-6">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.audit_id}
            className="bg-slate-800 rounded-xl p-4"
          >
            <p className="text-white">
              <span className="text-cyan-400">
                {activity.user_name}
              </span>{" "}
              {activity.action}ed{" "}
              <span className="font-semibold">
                {activity.document_title}
              </span>
            </p>

            <p className="text-slate-400 text-sm mt-1">
              {new Date(activity.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}