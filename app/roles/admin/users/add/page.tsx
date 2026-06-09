"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AddUserPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] =
    useState("");
  const [role, setRole] =
    useState("student");

  function handleSave() {
    if (
      !fullName ||
      !email ||
      !department
    ) {
      alert("Fill all fields");
      return;
    }

    alert(
      "Next step: Connect this form to Supabase Auth."
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-10 text-white">

        <h1 className="text-5xl font-bold mb-8">
          Add User
        </h1>

        <div className="bg-slate-900 p-8 rounded-xl max-w-2xl">

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            className="w-full p-3 rounded bg-slate-800 mb-4"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full p-3 rounded bg-slate-800 mb-4"
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
            className="w-full p-3 rounded bg-slate-800 mb-4"
          >
            <option value="student">
              Student
            </option>

            <option value="faculty">
              Faculty
            </option>
          </select>

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) =>
              setDepartment(
                e.target.value
              )
            }
            className="w-full p-3 rounded bg-slate-800 mb-6"
          />

          <div className="flex gap-4">

            <button
              onClick={handleSave}
              className="bg-cyan-500 text-black px-6 py-3 rounded-lg font-semibold"
            >
              Save
            </button>

            <button
              onClick={() =>
                router.push(
                  "/roles/admin/users"
                )
              }
              className="bg-slate-700 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}