"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.user) {
        toast("Login Failed");
        return;
      }

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

      if (!profile) {
        toast("Profile not found");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(profile)
      );

      switch (profile.role) {
        case "admin":
          router.push("/roles/admin");
          break;

        case "faculty":
          router.push("/roles/faculty");
          break;

        case "student":
          router.push("/roles/student");
          break;

        case "guest":
          router.push("/roles/guest");
          break;

        default:
          alert("Invalid Role");
      }
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
      min-h-screen
      relative
      flex
      items-center
      justify-center
      overflow-hidden
      "
    >
      {/* Background */}

      <div
        className="
        absolute
        inset-0
        bg-cover
        bg-center
        "
        style={{
          backgroundImage:
            "url('/bg-wave.png.jpg')",
        }}
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-black/70" />

      {/* Login Card */}

      <div
        className="
        relative
        z-10
        w-[520px]
        bg-black/85
        backdrop-blur-md
        rounded-[35px]
        px-8
        py-10
        border
        border-cyan-500/20
        shadow-[0_0_50px_rgba(6,182,212,0.35)]
        "
      >
        {/* Title */}

        <h1
          className="
          text-5xl
          font-extrabold
          text-cyan-400
          text-center
          drop-shadow-[0_0_20px_#06b6d4]
          "
        >
          TraceVault
        </h1>

        <p
          className="
          text-center
          text-slate-300
          text-1xl
          mt-1
          mb-10
          "
        >
          Secure Access Portal
        </p>

        {/* Email */}

        <div className="mb-7 flex flex-col items-center">
          <label
            className="
            w-[90%]
            mb-3
            text-left
            text-slate-400
            text-xl
            font-bold
            uppercase
            tracking-[5px]
            "
          >
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="name@example.com"
            className="
            w-[90%]
            h-20
            rounded-[28px]
            bg-black/20
            border
            border-slate-700
            px-8
            text-2xl
            text-white
            placeholder:text-slate-500
            focus:outline-none
            focus:border-cyan-400
            "
          />
        </div>

        {/* Password */}

        <div className="mb-10 flex flex-col items-center">
          <label
            className="
            w-[90%]
            mb-3
            text-left
            text-slate-400
            text-xl
            font-bold
            uppercase
            tracking-[5px]
            "
          >
            Password
          </label>

          <div className="relative w-[90%]">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password"
              className="
              w-full
              h-20
              rounded-[28px]
              bg-black/20
              border
              border-slate-700
              pl-8
              pr-20
              text-2xl
              text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:border-cyan-400
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="
              absolute
              right-8
              top-1/2
              -translate-y-1/2
              text-cyan-400
              text-3xl
              "
            >
              {showPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-[50%]
              h-18
              rounded-[28px]
              bg-cyan-500
              hover:bg-cyan-400
              transition
              duration-300
              text-black
              text-2xl
              font-bold
              shadow-[0_0_25px_rgba(6,182,212,0.45)]
            "
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </div>
      </div>
    </main>
  );
}