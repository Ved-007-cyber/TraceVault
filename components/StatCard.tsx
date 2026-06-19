import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number;
  href?: string;
}

export default function StatCard({
  title,
  value,
  href,
}: StatCardProps) {
  const card = (
    <div
      className="
      h-[150px]

      bg-slate-900/80

      border
      border-slate-800

      rounded-3xl

      flex
      flex-col

      items-center
      justify-center

      text-center

      hover:border-cyan-400
      hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]
      hover:scale-[1.02]

      transition-all
      duration-300
      "
    >
      {/* Title */}

      <h3
        className="
        text-slate-300

        text-xl
        font-medium

        mb-5
        "
      >
        {title}
      </h3>

      {/* Value */}

      <p
        className="
        text-7xl

        font-extrabold

        text-white

        leading-none
        "
      >
        {value}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block"
      >
        {card}
      </Link>
    );
  }

  return card;
}