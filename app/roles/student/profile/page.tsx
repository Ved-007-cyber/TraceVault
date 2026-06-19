"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StudentSidebar from "@/components/StudentSidebar";
import { toast } from "sonner";

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("");

  const [userId, setUserId] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [profilePhoto, setProfilePhoto] =
    useState("");

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
    setProfilePhoto(
      data.profile_photo || (
    data.gender === "female"
      ? "/default-female.png"
      : "/default-male.png"
  )
    );
  }

  async function uploadPhoto(file: File) {
    const fileName = `${userId}-${Date.now()}`;

    const { error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, {
        upsert: true,
        });

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

    const defaultImage =
        gender === "female"
            ? "/default-female.png"
            : "/default-male.png";

    await supabase
        .from("profiles")
        .update({
            full_name: fullName,
            phone,
            bio,
            gender,
            profile_photo:
            profilePhoto.includes("default")
                ? defaultImage
                : profilePhoto,
        })
        .eq("id", userId);

    const { error } = await supabase
        .from("profiles")
        .update({
        full_name: fullName,
        phone: phone,
        bio: bio,
        gender: gender,
        profile_photo: profilePhoto,
        })
        .eq("id", userId);

    setLoading(false);

    if (error) {
        toast.error(error.message);
        return;
    }

    toast("Profile Updated Successfully");
   }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/student-bg.jpg')",
        }}
      />

      <div className="relative z-10 flex min-h-screen">

        <StudentSidebar />

        <main className="flex-1 p-8 text-white">

          <h1 className="text-6xl font-semibold 
          flex items-center justify-center
          mb-2">
            My Profile
          </h1>

          <p className="text-slate-300 
          flex items-center justify-center
          mb-8">
            Manage your personal information
          </p>

          <div
            className="
            w-full
            h-full
            bg-slate-900/80
            backdrop-blur-xl
            border border-slate-800
            rounded-3xl
            p-10
  "
          >

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-10">

              <img
                src={
                  profilePhoto
                  ? profilePhoto
                  : gender === "female"
                  ? "/default-female.jpg"
                  : "/default-male.jpg"
                }
                alt="Profile"
                className="
                w-52
                h-52
                rounded-full
                object-cover
                border-[5px]
                border-cyan-500
                shadow-[0_0_30px_rgba(6,182,212,0.5)]
                "
              />

              <label
                className="
                mt-5
                bg-cyan-500
                text-black
                px-6
                py-3
                rounded-xl
                cursor-pointer
                font-semibold
                "
              >
                Change Photo

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (file) {
                      uploadPhoto(file);
                    }
                  }}
                />
              </label>

            </div>

            {/* Form */}
            <div className="grid lg:grid-cols-2 gap-8 mt-8">

              <div>
                <label className="block mb-2 h-14text-slate-300">
                  Full Name
                </label>

                <input
                  value={fullName}
                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }
                  className="
                  w-full
                  h-14
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-4
                  "
                />
              </div>

              <div>
                <label className="block mb-2 text-slate-300">
                  Email
                </label>

                <input
                  value={email}
                  disabled
                  className="
                  w-full h-14
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-4
                  opacity-60
                  "
                />
              </div>

              <div>
                <label className="block mb-2 text-slate-300">
                  Department
                </label>

                <input
                  value={department}
                  disabled
                  className="
                  w-full h-14
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-4
                  opacity-60
                  "
                />
              </div>

              <div>
                <label className="block mb-2 text-slate-300">
                    Gender
                </label>

                <select
                    value={gender}
                    onChange={(e) => {
                    const selectedGender = e.target.value;

                    setGender(selectedGender);

                    if (
                        !profilePhoto ||
                        profilePhoto.includes("default-male") ||
                        profilePhoto.includes("default-female")
                    ) {
                        setProfilePhoto(
                        selectedGender === "female"
                            ? "/default-female.png"
                            : "/default-male.png"
                        );
                    }
                    }}
                    className="
                    w-full h-14
                    bg-slate-800
                    border
                    border-slate-700
                    rounded-xl
                    p-4
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

              <div>
                <label className="block mb-2 text-slate-300">
                  Phone Number
                </label>

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  className="
                  w-full h-14
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  p-4
                  "
                />
              </div>

            </div>

            <div className="mt-6">

              <label className="block mb-2 text-slate-300">
                Bio
              </label>

              <textarea
                rows={5}
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                className="
                w-full
                bg-slate-800
                border border-slate-700
                rounded-xl
                p-4
                "
              />

            </div>

            <button
                onClick={saveProfile}
                disabled={loading}
                className="
                mt-8
                w-full
                h-10
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                font-bold
                text-lg
                py-4
                rounded-2xl
                transition-all
                hover:scale-[1.02]
                "
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}