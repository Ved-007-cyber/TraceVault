"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();

  const role = searchParams.get("role") || "faculty";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    window.location.href = `/roles/${role}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800">

        <h1 className="text-4xl font-bold text-white mb-2">
          {role.toUpperCase()}
        </h1>

        <p className="text-slate-400 mb-6">
          Please provide your credentials to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-slate-800 text-white mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-cyan-500 text-black font-semibold py-3 rounded-lg"
        >
          Login
        </button>

      </div>

    </main>
  );
}