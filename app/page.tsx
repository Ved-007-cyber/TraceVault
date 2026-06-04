import Link from "next/link";

const roles = [
  {
    title: "Admin",
    description: "Manage users, audit logs and security",
    color: "border-red-500",
    href: "/login?role=admin",
  },
  {
    title: "Faculty",
    description: "Upload, encrypt and share documents",
    color: "border-cyan-500",
    href: "/login?role=faculty",
  },
  {
    title: "Student",
    description: "Access and download shared files",
    color: "border-green-500",
    href: "/login?role=student",
  },
  {
    title: "Guest",
    description: "View limited shared resources",
    color: "border-yellow-500",
    href: "/login?role=guest",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-7xl font-bold text-center">
          TraceVault
        </h1>

        <p className="text-center text-slate-400 text-xl mt-4">
          Secure Academic File Sharing Platform
        </p>

        <h2 className="text-center text-3xl font-semibold mt-16">
          Select Your Role
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">

          {roles.map((role) => (
            <Link
              key={role.title}
              href={role.href}
              className={`bg-slate-900 border-2 ${role.color}
              rounded-3xl p-8 hover:scale-105 transition duration-300`}
            >
              <h3 className="text-3xl font-bold mb-4">
                {role.title}
              </h3>

              <p className="text-slate-400">
                {role.description}
              </p>
            </Link>
          ))}

        </div>

      </div>

    </main>
  );
}