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
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (data) {
      setActivities(data);
    }
  }

  function getAction(action: string) {
    switch (action) {
      case "Share":
      case "Shared":
        return "shared";

      case "View":
      case "Viewed":
        return "viewed";

      case "Download":
      case "Downloaded":
        return "downloaded";

      case "Upload":
      case "Uploaded":
        return "uploaded";

      default:
        return action.toLowerCase();
    }
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-6 space-y-5 border border-slate-800">

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
              ">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity) => (

          <div
            key={activity.audit_id}
            className="
            h-14 
            border-b
            border-slate-800  
            pb-3"
          >

            <p className="text-white">

              <span className="text-xl text-cyan-400 font-semibold">
                {activity.user_name || "Unknown User"}
              </span>

              {" "}
              {getAction(activity.action)}
              {" "}

              <span className="font-semibold">
                {activity.document_title || "Document"}
              </span>

            </p>

            <p className="text-slate-400 text-lg ">
              {new Date(
                activity.created_at
              ).toLocaleString()}
            </p>

          </div>

        ))}

        {activities.length === 0 && (
          <div className="text-slate-400">
            No recent activity
          </div>
        )}

      </div>

    </div>
  );
}