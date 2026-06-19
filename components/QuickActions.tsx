import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { text } from "stream/consumers";

export default function QuickActions() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    
    <div className=" rounded-3xl p-5 gap-8  border border-slate-800">

      {/* Quick Actions */}

          <div
            className="
            col-span-4

            bg-slate-900/80

            border
            border-slate-800

            rounded-2xl

            p-5

            flex
            flex-col
            h-[320px]
            "
          >
            <h2 className="text-3xl 
              font-bold 
              text-white
              border
              border-slate-600 
              rounded-2xl
              flex
              items-center
              justify-center
              mb-5
              ">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-2 flex-1">
              <button
                onClick={() => router.push("/files")}
                className="
                  bg-cyan-900/70
                  backdrop-blur-md
                  border border-cyan-500/20

                  hover:bg-cyan-400
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]

                  rounded-2xl

                  flex
                  flex-col
                  items-center
                  justify-center

                  h-full
                  w-full

                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  group
                  "
              >
                <img
                  src="/icons/Doc_image.png"
                  alt="Documents"
                  className="
                  w-20
                  h-20
                  object-contain
                  group-hover:scale-110
                  transition-all
                  duration-300
                  "
                />
                <span className="font-semibold text-white text-lg">
                  Documents
                </span>
              </button>

              <button
                onClick={() => router.push("/upload")}
                className="
                  bg-cyan-900/70
                  backdrop-blur-md
                  border border-cyan-500/20

                  hover:bg-cyan-400
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]

                  rounded-2xl

                  flex
                  flex-col
                  items-center
                  justify-center

                  h-full
                  w-full

                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  group
                  "
              >
                <img
                  src="/icons/upload.png"
                  alt="Upload File"
                  className="
                  w-20
                  h-20
                  object-contain
                  group-hover:scale-110
                  transition-all
                  duration-300
                  "
                />
                <span className="font-semibold text-white text-lg">
                  Upload
                </span>
              </button>

              <button
                onClick={() => router.push("/share")}
                className="
                  bg-cyan-900/70
                  backdrop-blur-md
                  border border-cyan-500/20

                  hover:bg-cyan-400
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]

                  rounded-2xl

                  flex
                  flex-col
                  items-center
                  justify-center

                  h-full
                  w-full

                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  group
                  "
              >
                <img
                  src="/icons/shared_link_image.jpg"
                  alt="Shared Files"
                  className="
                  w-20
                  h-20
                  object-contain
                  group-hover:scale-110
                  transition-all
                  duration-300
                  "
                />
                <span className="font-semibold text-white text-lg">
                  Shared Files
                </span>
              </button>

              <button
                onClick={() => router.push("/audit")}
                className="
                  bg-cyan-900/70
                  backdrop-blur-md
                  border border-cyan-500/20

                  hover:bg-cyan-400
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]

                  rounded-2xl

                  flex
                  flex-col
                  items-center
                  justify-center

                  h-full
                  w-full

                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  group
                  "
              >
                <img
                  src="/icons/audit_log_image.jpg"
                  alt="Audit Logs"
                  className="
                  w-20
                  h-20
                  object-contain
                  group-hover:scale-110
                  transition-all
                  duration-300
                  "
                />
                <span className="font-semibold text-white text-lg">
                  Audit Logs
                </span>
              </button>

            </div>

      </div>

    </div>
  );
}




          
            
