"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

export default function FacultyProfilePage() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [gender, setGender] = useState("male");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!data) return;

    setFullName(data.full_name || "");
    setEmail(data.email || "");
    setDepartment(data.department || "");

    setGender(data.gender || "male");

    setPhone(data.phone || "");
    setBio(data.bio || "");

    setProfilePhoto(data.profile_photo || "");
  }

  async function uploadPhoto(file: File) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file);

    if (error) {
      toast.error(error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);

    setProfilePhoto(publicUrl);
  }

  async function saveProfile() {
    setLoading(true);

    const finalPhoto =
      profilePhoto ||
      (gender === "female"
        ? "/default-female.png"
        : "/default-male.png");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        gender,
        phone,
        bio,
        profile_photo: finalPhoto,
      })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setProfilePhoto(finalPhoto);

    toast("Profile Updated Successfully");
  }

  const avatarSrc =
    profilePhoto && profilePhoto.trim() !== ""
      ? profilePhoto
      : gender === "female"
      ? "/default-female.png"
      : "/default-male.png";

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 overflow-hidden">
        <div
            className="
            w-full
            h-full
            rounded-[32px]
            bg-gradient-to-br
            from-cyan-600
            via-blue-700
            to-purple-800
            p-6
            "
        >
            <div
            className="
            w-full
            h-full
            bg-slate-900/70
            backdrop-blur-xl
            border
            border-white/10
            rounded-[32px]
            p-8
            flex
            flex-col
            "
            >
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-6xl font-black text-white">
                Faculty Profile
                </h1>

                <p className="text-slate-300 text-lg">
                Manage your faculty information
                </p>
            </div>

            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-8">
                <img
                src={avatarSrc}
                alt="Profile"
                className="
                w-40
                h-40
                rounded-full
                object-cover
                border-4
                border-cyan-400
                shadow-[0_0_40px_rgba(34,211,238,0.4)]
                "
                />

                <label
                className="
                mt-4
                px-6
                py-3
                rounded-full
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                font-bold
                cursor-pointer
                transition
                "
                >
                Change Photo

                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                        uploadPhoto(file);
                    }
                    }}
                />
                </label>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                <label className="text-slate-300 block mb-2">
                    Full Name
                </label>

                <input
                    value={fullName}
                    onChange={(e) =>
                    setFullName(e.target.value)
                    }
                    className="
                    w-full
                    h-14
                    bg-slate-800/70
                    border
                    border-slate-700
                    rounded-2xl
                    px-4
                    text-white
                    "
                />
                </div>

                <div>
                <label className="text-slate-300 block mb-2">
                    Email
                </label>

                <input
                    value={email}
                    disabled
                    className="
                    w-full
                    h-14
                    bg-slate-800/70
                    border
                    border-slate-700
                    rounded-2xl
                    px-4
                    text-slate-400
                    "
                />
                </div>

                <div>
                <label className="text-slate-300 block mb-2">
                    Department
                </label>

                <input
                    value={department}
                    disabled
                    className="
                    w-full
                    h-14
                    bg-slate-800/70
                    border
                    border-slate-700
                    rounded-2xl
                    px-4
                    text-slate-400
                    "
                />
                </div>

                <div>
                <label className="text-slate-300 block mb-2">
                    Gender
                </label>

                <select
                    value={gender}
                    onChange={(e) =>
                    setGender(e.target.value)
                    }
                    className="
                    w-full
                    h-14
                    bg-slate-800/70
                    border
                    border-slate-700
                    rounded-2xl
                    px-4
                    text-white
                    "
                >
                    <option value="male">
                    Male
                    </option>

                    <option value="female">
                    Female
                    </option>
                </select>
                </div>

                <div className="col-span-2">
                <label className="text-slate-300 block mb-2">
                    Phone Number
                </label>

                <input
                    value={phone}
                    onChange={(e) =>
                    setPhone(e.target.value)
                    }
                    className="
                    w-full
                    h-14
                    bg-slate-800/70
                    border
                    border-slate-700
                    rounded-2xl
                    px-4
                    text-white
                    "
                />
                </div>
            </div>

            {/* Bio */}
            <div className="flex-1 mt-6 flex flex-col">
                <label className="text-slate-300 block mb-2">
                Bio
                </label>

                <textarea
                value={bio}
                onChange={(e) =>
                    setBio(e.target.value)
                }
                className="
                flex-1
                w-full
                bg-slate-800/70
                border
                border-slate-700
                rounded-2xl
                p-4
                text-white
                resize-none
                "
                />
            </div>

            {/* Save Button */}
            <button
                onClick={saveProfile}
                disabled={loading}
                className="
                mt-6
                h-14
                w-full
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                font-bold
                text-xl
                rounded-2xl
                transition
                "
            >
                {loading
                ? "Saving..."
                : "Save Changes"}
            </button>
            </div>
        </div>
        </main>
    </div>
    );
}