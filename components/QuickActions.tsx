import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-white mb-5">
        Quick Actions
      </h2>

      <div className="flex flex-col gap-4">

        <Link
          href="/upload"
          className="bg-cyan-500 text-black p-4 rounded-xl"
        >
          Upload Document
        </Link>

        <Link
          href="/files"
          className="bg-slate-800 text-white p-4 rounded-xl"
        >
          My Documents
        </Link>

      </div>

    </div>
  );
}