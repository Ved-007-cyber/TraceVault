"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudentTopbar() {
  const [name, setName] = useState("Student");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .single();

    if (data) {
      setName(data.full_name);
      setDepartment(data.department);
    }
  }

  return (
    <div className="mb-10">
      <h1 className="text-5xl font-bold text-white">
        Welcome back, {name}
      </h1>

      <p className="text-slate-400 mt-3">
        Student Dashboard 🎓
      </p>

      <p className="text-cyan-400 mt-2">
        STUDENT • {department}
      </p>
    </div>
  );
}