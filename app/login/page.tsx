"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      console.log("AUTH DATA:", data);
      console.log("AUTH ERROR:", error);

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("Login failed");
        return;
      }

      console.log("AUTH USER:", data.user);
      console.log("AUTH EMAIL:", data.user.email);
      

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", data.user.email)
        .single();

      console.log("PROFILE:", profile);
      console.log("PROFILE ERROR:", profileError);

      if (profileError || !profile) {
        alert("Profile not found");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(profile)
      );

      if (profile.role === "admin") {
        router.push("/roles/admin");
      } else if (profile.role === "faculty") {
        router.push("/roles/faculty");
      } else if (profile.role === "student") {
        router.push("/roles/student");
      } else {
        alert("Invalid user role");
      }
    } catch (err) {
      console.error(err);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800">

        <h1 className="text-4xl font-bold text-white mb-2">
          TraceVault Login
        </h1>

        <p className="text-slate-400 mb-6">
          Sign in to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-slate-800 text-white mb-6"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-cyan-500 text-black font-semibold py-3 rounded-lg hover:bg-cyan-400"
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>

      </div>
    </main>
  );
}