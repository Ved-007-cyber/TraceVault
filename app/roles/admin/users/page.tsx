"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import { create } from "domain";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] =
  useState(false);
  const [roleFilter, setRoleFilter] =
  useState("all");
  const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [department, setDepartment] = useState("IT");
const [role, setRole] = useState("student");

async function createUser() {
  try {

    const { data, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    console.log("AUTH DATA:", data);
    console.log("AUTH ERROR:", authError);

    if (authError) {
      toast.error(authError.message);
      return;
    }

    console.log("USER ID:", data.user?.id);

    const { error: profileError } =
      await supabase
        .from("profiles")
        .insert([
          {
            id: data.user?.id,
            full_name: fullName,
            email,
            role,
            department,
          },
        ]);

    console.log("PROFILE ERROR:", profileError);

    if (profileError) {
      toast.error(profileError.message);
      return;
    }

    toast.success("User created successfully");

    loadUsers();

    setShowAddUser(false);

  } catch (err) {
    console.error(err);
    toast.success("Failed to create user");
  }
}


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
  (user) => {
    const matchesSearch =
      user.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all"
        ? true
        : user.role === roleFilter;

    return matchesSearch && matchesRole;
  }
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
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}

      <div
        className="
        absolute
        inset-0
        bg-cover
        bg-center
        bg-no-repeat
        "
        style={{
          backgroundImage:
          "url('/admin-bg.jpg')",
        }}
      />

      {/* Content */}

      <div className="relative z-10 flex min-h-screen text-white">
      <AdminSidebar />

      <main className="flex-1 p-10">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-5xl font-bold text-white">
              User Management
            </h1>

            <p className="text-white text-slate-400 mt-2">
              Manage students, faculty and administrators
            </p>
          </div>

          <button
          onClick={()=>
            setShowAddUser(true)
          }
            className="
            px-6
            py-3
            rounded-xl
            bg-cyan-500
            hover:bg-cyan-400
            text-black
            font-bold
            "
          >
            + Add User
          </button>

        </div>

        {/* Search */}

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
          w-full
          mb-8
          h-12
          px-4
          rounded-xl
          bg-slate-800
          border
          border-slate-700
          text-white
          "
        />
        <div className="mb-4">
          <span className="text-white text-slate-400">
            Showing:
          </span>

          <span className="ml-2 text-cyan-400 font-semibold capitalize">
            {roleFilter === "all"
              ? "All Users"
              : roleFilter}
          </span>

        </div>
      
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900 rounded-1xl p-5">
            <div
              onClick={() =>
                setRoleFilter("all")
              }
              className="
              cursor-pointer

              bg-slate-900/70
              

              rounded-2xl

              p-5

              
              "
            >
            <p className="text-slate-400 ">
              Total Users
            </p>
            <h2 className="text-3xl font-bold text-white">
              {users.length}
            </h2>
          </div>
          </div>

          <div className="bg-slate-900 rounded-1xl p-5">
            
            <div
            onClick={() =>
              setRoleFilter("student")
            }
            className="
            cursor-pointer
            bg-slate-900/70
            rounded-2xl
            p-5
            
            "
          >
            <p className="text-slate-400 text-sm">
              Students
            </p>
            <h2 className="text-3xl font-bold text-green-400">
              {
                users.filter(
                  u => u.role === "student"
                ).length
              }
            </h2>
          </div>
          </div>
          
          <div className="bg-slate-900 rounded-1xl p-5">
            <div
              onClick={() =>
                setRoleFilter("faculty")
              }
              className="
              cursor-pointer
              bg-slate-900/70
              rounded-2xl
              p-5
              "
            >
            <p className="text-slate-400 text-sm">
              Faculty
            </p>
            <h2 className="text-3xl font-bold text-cyan-400">
              {
                users.filter(
                  u => u.role === "faculty"
                ).length
              }
            </h2>
          </div>
          </div>

          <div className="bg-slate-900 rounded-1xl p-5">
            <div
              onClick={() =>
                setRoleFilter("admin")
              }
              className="
              cursor-pointer
              bg-slate-900/70
              rounded-2xl
              p-5
              "
            >
            <p className="text-slate-400 text-sm">
              Admins
            </p>
            <h2 className="text-3xl font-bold text-red-400">
              {
                users.filter(
                  u => u.role === "admin"
                ).length
              }
            </h2>
          </div>
          </div>

        </div>
        {/* Table */}

        <div
          className="
          mt-6
          bg-slate-900/70
          backdrop-blur-md

          border
          border-slate-800

          rounded-1xl

          overflow-hidden
          "
        >
          <table className="w-full">

            <thead className="bg-slate-800/80">

              <tr>

                <th className="px-6 py-5 text-left">
                  Name
                </th>

                <th className="px-6 py-5 text-left">
                  Email
                </th>

                <th className="px-6 py-5 text-left">
                  Role
                </th>

                <th className="px-6 py-5 text-left">
                  Department
                </th>

                <th className="px-6 py-5 text-center">
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
                    className="
                    border-b
                    border-slate-800
                    hover:bg-slate-800/50
                    transition
                    "
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">

                        <div
                          className="
                          w-11
                          h-11

                          rounded-full

                          bg-cyan-500

                          flex
                          items-center
                          justify-center

                          text-black
                          font-bold
                          "
                        >
                          {user.full_name?.charAt(0)}
                        </div>

                        <div>

                          <p className="font-semibold text-white">
                            {user.full_name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {user.department}
                          </p>

                        </div>

                      </div>

                    </td>
                    <td className="px-6 py-5">
                      {user.email}
                    </td>
                    <td className="px-6 py-5">
                      {user.role === "student" && (
                        <span
                          className="
                          px-3
                          py-1

                          rounded-full

                          bg-green-500/20
                          text-green-400

                          text-sm
                          "
                        >
                          Student
                        </span>
                      )}

                      {user.role === "faculty" && (
                        <span
                          className="
                          px-3
                          py-1

                          rounded-full

                          bg-cyan-500/20
                          text-cyan-400

                          text-sm
                          "
                        >
                          Faculty
                        </span>
                      )}

                      {user.role === "admin" && (
                        <span
                          className="
                          px-3
                          py-1

                          rounded-full

                          bg-red-500/20
                          text-red-400

                          text-sm
                          "
                        >
                          Admin
                        </span>
                      )}

                    </td>
                    <td className="px-6 py-5">
                      {user.department}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-2">

                        

                        <button
                          onClick={() =>
                            deleteUser(
                              user.id,
                              user.role
                            )
                          }
                          className="
                          px-3
                          py-2

                          rounded-lg

                          bg-red-500
                          hover:bg-red-600

                          text-white
                          "
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>
        {showAddUser && (
  <div
    className="
    fixed
    inset-0

    bg-black/70

    flex
    items-center
    justify-center

    z-50
    "
  >
    <div
      className="
      w-[700px]
      max-w-[90vw]

      bg-slate-900/95
      backdrop-blur-md

      border
      border-cyan-500/30

      rounded-3xl

      shadow-[0_0_40px_rgba(6,182,212,0.25)]

      overflow-hidden
      "
    >
      <div
        className="
        flex
        justify-between
        items-center

        px-8
        py-6

        border-b
        border-slate-400
        "
      >
        <div>
          <h2 className="text-4xl font-bold text-white">
            Add User
          </h2>

          <p className="text-slate-400 mt-1 flex flex-col gap-1">
            Create a new TraceVault account
          </p>
        </div>

        <button
          onClick={() => setShowAddUser(false)}
          className="
          w-10
          h-10

          rounded-half

          bg-slate-800
          hover:bg-slate-700

          text-xl
          "
        >
          ✕
        </button>
      </div>

      <div className="p-8 flex flex-col gap-2">

        <input
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          placeholder="Full Name"
          className="
          w-[95%]
          h-14
          px-4
          rounded-xl
          bg-slate-800
          border
          border-slate-700
          focus:border-cyan-400
          focus:outline-none
          text-white
          "
        />

        <input
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Email"
          className="
          w-[95%]
          h-14
          px-4
          rounded-xl
          bg-slate-800
          border
          border-slate-700
          focus:border-cyan-400
          focus:outline-none
          text-white
          "
        />
        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Temporary Password"
          className="
          w-[95%]
          h-14
          px-4
          rounded-xl
          bg-slate-800
          border
          border-slate-700
          text-white
          gap-5
          "
        />
        <div className="grid grid-cols-2 gap-5">
        <select
          value={department}
          onChange={(e) =>
            setDepartment(e.target.value)
          }
          className="
          w-[95%]
          h-14
          px-4
          rounded-xl
          bg-slate-800
          border
          border-slate-700
          focus:border-cyan-400
          focus:outline-none
          text-white
          "
        > <option>
          CSE
        </option>
        <option>
          IT
        </option>
        <option>
          ECE
        </option>
        <option>
          ME/CE
        </option>
        <option>
          AI/Ml
        </option>
        <option>
          Cybersecurity
        </option>
        <option>
          EEE
        </option>
        </select>

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value.toLowerCase()
            )
          }
          className="
          w-[95%]
          h-14
          px-4
          rounded-xl
          bg-slate-800
          border
          border-slate-700
          focus:border-cyan-400
          focus:outline-none
          text-white
          "
        >
          <option>
            Student
          </option>

          <option>
            Faculty
          </option>
        </select>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={() => setShowAddUser(false)}
            className="
            flex-1

            h-14

            rounded-xl

            bg-slate-800
            hover:bg-slate-700

            font-semibold
            "
          >
            Cancel
          </button>

          <button
            onClick={createUser}
            className="
            flex-1

            h-14

            rounded-xl

            bg-cyan-500
            hover:bg-cyan-400

            text-black
            font-bold
            "
          >
            Create User
          </button>

        </div>

      </div>

    </div>
  </div>
)}
      </main>
      </div>
    </div>
  );
}