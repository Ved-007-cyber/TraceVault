"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="bg-slate-900 p-10 rounded-2xl text-center">

        <h1 className="text-5xl font-bold text-cyan-400 mb-8">
          TraceVault
        </h1>

        <div className="flex flex-col gap-4">

          <button
            onClick={() => router.push("/login")}
            className="bg-red-500 text-white px-6 py-3 rounded-lg"
          >
            Admin Login
          </button>

          <button
            onClick={() => router.push("/login")}
            className="bg-cyan-500 text-black px-6 py-3 rounded-lg"
          >
            Faculty Login
          </button>

          <button
            onClick={() => router.push("/login")}
            className="bg-green-500 text-black px-6 py-3 rounded-lg"
          >
            Student Login
          </button>

        </div>

      </div>
    </main>
  );
}