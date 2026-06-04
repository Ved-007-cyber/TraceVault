import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 text-white flex flex-col">

      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-cyan-400">
          TraceVault
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Secure Sharing
        </p>
      </div>

      <nav className="flex flex-col gap-2 p-4">

        <Link
          href="/roles/faculty"
          className="bg-cyan-500 text-black p-4 rounded-xl font-semibold"
        >
          Dashboard
        </Link>

        <Link
          href="/files"
          className="p-4 rounded-xl hover:bg-slate-900"
        >
          Documents
        </Link>

        <Link
          href="/upload"
          className="p-4 rounded-xl hover:bg-slate-900"
        >
          Upload
        </Link>

        <Link
          href="/share"
          className="p-4 rounded-xl hover:bg-slate-900"
        >
          Shared Files
        </Link>

        <Link
          href="/audit"
          className="p-4 rounded-xl hover:bg-slate-900"
        >
          Audit Trail
        </Link>

      </nav>

      <div className="mt-auto p-4 border-t border-slate-800">
        <p className="font-semibold">
          Vedhesh
        </p>

        <p className="text-sm text-slate-500">
          Faculty
        </p>
      </div>

    </aside>
  );
}