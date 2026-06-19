import Link from "next/link";

export default function Home() {
  return (
    <main
      className="
      min-h-screen
      relative
      overflow-hidden
      bg-black
      text-white
      "
    >
      {/* Background */}

      <div
        className="
        absolute
        inset-0
        bg-cover
        bg-center
        opacity-40
        "
        style={{
          backgroundImage:
            "url('/images/sample.jpg')",
        }}
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-slate-950/80 to-slate-950/40" />

      {/* Feature List */}

      <div
        className="
        absolute
        bottom-12
        left-10
        z-20
        "
      >
        <div className="space-y-5">

          <div className="flex items-center gap-5">
            <span className="text-cyan-400 text-4xl drop-shadow-[0_0_10px_#06b6d4]">
              🔒
            </span>

            <span className="text-2xl text-cyan-400 drop-shadow-[0_0_8px_#ffffff]">
              AES Encryption
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-cyan-400 text-4xl drop-shadow-[0_0_10px_#06b6d4]">
              📄
            </span>

            <span className="text-2xl text-cyan-400 drop-shadow-[0_0_8px_#ffffff]">
              Secure Document Sharing
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-cyan-400 text-4xl drop-shadow-[0_0_10px_#06b6d4]">
              🛡️
            </span>

            <span className="text-2xl text-cyan-400 drop-shadow-[0_0_8px_#ffffff]">
              Complete Audit Trail
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-cyan-400 text-4xl drop-shadow-[0_0_10px_#06b6d4]">
              ☁️
            </span>

            <span className="text-2xl text-cyan-400 drop-shadow-[0_0_8px_#ffffff]">
              Cloud Storage
            </span>
          </div>

        </div>
      </div>

      {/* Main Content */}

      <div
        className="
        relative
        z-20
        flex
        flex-col
        items-center
        justify-center
        min-h-screen
        text-center
        px-6
        "
      >
        <h1
          className="
          text-8xl
          md:text-9xl
          font-extrabold
          text-cyan-400
          drop-shadow-[0_0_30px_#06b6d4]
          tracking-wide
          "
        >
          TraceVault
        </h1>

        <p
          className="
          mt-6
          text-2xl
          text-slate-300
          "
        >
          Secure Academic File Sharing Platform
        </p>

        <p
          className="
          mt-6
          text-2xl
          text-white
          "
        >
          Protect • Share • Audit
        </p>

        <Link
          href="/login"
          className="
          mt-10
          group
          "
        >
          <div
            className="
            w-72
            h-20
            rounded-2xl
            border-2
            border-cyan-400
            flex
            items-center
            justify-center
            backdrop-blur-sm
            bg-black/20
            shadow-[0_0_25px_#06b6d4]
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:shadow-[0_0_40px_#06b6d4]
            "
          >
            <span
              className="
              text-cyan-400
              text-5xl
              font-bold
              drop-shadow-[0_0_15px_#06b6d4]
              "
            >
              Login
            </span>
          </div>
        </Link>
      </div>
    </main>
  );
}