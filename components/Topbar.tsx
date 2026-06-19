"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Topbar() {
  const [name, setName] = useState("User");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", "hafreed@tracevault.com")
    .single();

  console.log("PROFILE DATA:", data);
  console.log("PROFILE ERROR:", JSON.stringify(error, null, 2));

  if (data) {
    setName(data.full_name);
    setRole(data.role);
    setDepartment(data.department);
  }
}

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <div className="mb-10">
      <h1 className="text-5xl whitespace-pre  font-bold text-white"
          style={{ tabSize:0}}
      >
        {"\t"} Welcome back, {name}
      </h1>

      <p className="text-slate-400 mt-3 whitespace-pre"
      style={{tabSize:1.2}}>
        {"\t"} {greeting} 👋
      </p>

      <p className="text-cyan-400 mt-2 whitespace-pre"
      style={{tabSize:1}}>
        {"\t"} {role.toUpperCase()} • {department}
      </p>
    </div>
  );
}