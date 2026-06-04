import Link from "next/link";

export default function DashboardPage() {
  const cards = [
    {
      title: "Files",
      description: "Upload, encrypt and manage files",
      href: "/files",
      icon: "📁",
    },
    {
      title: "Share",
      description: "Secure document sharing",
      href: "/share",
      icon: "🔗",
    },
    {
      title: "Audit Logs",
      description: "Track every activity",
      href: "/audit",
      icon: "📜",
    },
    {
      title: "Admin",
      description: "Manage users & roles",
      href: "/admin",
      icon: "⚙️",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-cyan-400">
          TraceVault
        </h1>

        <div className="flex gap-4">
          <button className="px-4 py-2 bg-slate-800 rounded-lg">
            Faculty
          </button>

          <button className="px-4 py-2 bg-red-500 rounded-lg">
            Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-10 py-10">
        <h2 className="text-5xl font-bold">
          Welcome Back 👋
        </h2>

        <p className="text-slate-400 mt-3">
          Secure Academic File Sharing Platform
        </p>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-6 px-10">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400">Files Stored</h3>
          <p className="text-4xl font-bold mt-2">128</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400">Shares Active</h3>
          <p className="text-4xl font-bold mt-2">42</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400">Audit Logs</h3>
          <p className="text-4xl font-bold mt-2">1,240</p>
        </div>

      </section>

      {/* Modules */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-10 py-12">

        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-cyan-400 hover:scale-105 transition duration-300"
          >
            <div className="text-5xl mb-4">
              {card.icon}
            </div>

            <h3 className="text-2xl font-semibold mb-2">
              {card.title}
            </h3>

            <p className="text-slate-400">
              {card.description}
            </p>
          </Link>
        ))}

      </section>

      {/* Recent Activity */}
      <section className="px-10 pb-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4 text-slate-300">

            <div>
              📄 QuestionPaper.pdf uploaded
            </div>

            <div>
              🔗 Research.docx shared with Faculty
            </div>

            <div>
              👁️ Student viewed LabManual.pdf
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}