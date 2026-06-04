import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number;
  href: string;
}

export default function StatCard({
  title,
  value,
  href,
}: StatCardProps) {
  return (
    <Link href={href}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-400 transition">

        <h3 className="text-slate-400">
          {title}
        </h3>

        <p className="text-4xl font-bold mt-2 text-white">
          {value}
        </p>

      </div>
    </Link>
  );
}