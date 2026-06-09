"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setUsers(data);
    }

    setLoading(false);
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      user.role
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  async function deleteUser(id: string, role: string) {
    if (role === "admin") {
      alert("Admin cannot be deleted");
      return;
    }

    const confirmDelete = confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await supabase
        .from("sharelinks")
        .delete()
        .or(
          `shared_with_user_id.eq.${id}`
        );

      await supabase
        .from("audit_logs")
        .delete()
        .eq("user_id", id);

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      alert("User Deleted");

      loadUsers();
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-10 text-white">
        <h1 className="text-5xl font-bold mb-8">
          User Management
        </h1>
        <button
            onClick={() =>
            window.location.href =
                "/roles/admin/users/add"
            }
            className="bg-cyan-500 text-black px-5 py-3 rounded-lg font-semibold"
        >
            + Add User
        </button>
    
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            mb-6
            p-3
            rounded-xl
            bg-slate-800
            border
            border-slate-700
          "
        />

        <div className="bg-slate-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-800">

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-left">
                  Department
                </th>

                <th className="p-4 text-left">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center"
                  >
                    No Users Found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-800"
                  >
                    <td className="p-4">
                      {user.full_name}
                    </td>

                    <td className="p-4">
                      {user.email}
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          user.role === "admin"
                            ? "text-red-400"
                            : user.role === "faculty"
                            ? "text-cyan-400"
                            : "text-green-400"
                        }
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      {user.department}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() =>
                          deleteUser(
                            user.id,
                            user.role
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </main>
    </div>
  );
}