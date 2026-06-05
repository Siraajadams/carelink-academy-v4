"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const COURSE_OPTIONS = [
  "CareLink Academy",
  "Videomed",
  "CPNBS",
  "Clinical Voice Transcriber",
  "Pharmacy First",
  "Weight Management",
  "HIV Prevention Services",
  "Travel Health",
  "Independent Prescribing",
  "Vaccination Services",
];

export default function ProfilePage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("South Africa");
  const [profession, setProfession] = useState("Pharmacist");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [workSetting, setWorkSetting] = useState("Pharmacy");
  const [organisation, setOrganisation] = useState("");
  const [platformAccess, setPlatformAccess] = useState<string[]>([
    "CareLink Academy",
    "Videomed",
    "CPNBS",
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  function calculateAge(date: string) {
    if (!date) {
      setAge("");
      return;
    }

    const birth = new Date(date);
    const today = new Date();

    let calculated = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      calculated--;
    }

    setAge(String(calculated));
  }

  function parsePlatformAccess(value: string | string[] | null) {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value;
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function loadProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("healthcare_workers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setFirstName(data.first_name || "");
      setSurname(data.surname || "");
      setDob(data.date_of_birth || "");
      setAge(data.age ? String(data.age) : "");
      setGender(data.gender || "");
      setCountry(data.country || "South Africa");
      setProfession(data.profession || "Pharmacist");
      setRegistrationNumber(data.registration_number || "");
      setWorkSetting(data.work_setting || "Pharmacy");
      setOrganisation(data.organisation || "");
      setPlatformAccess(
        parsePlatformAccess(data.platform_access_needed) || [
          "CareLink Academy",
          "Videomed",
          "CPNBS",
        ]
      );
    }

    setLoading(false);
  }

  function toggleCourse(course: string) {
    if (platformAccess.includes(course)) {
      setPlatformAccess(platformAccess.filter((item) => item !== course));
    } else {
      setPlatformAccess([...platformAccess, course]);
    }
  }

  async function saveProfile() {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in first.");
      return;
    }

    const profileData = {
      user_id: user.id,
      email: user.email,
      first_name: firstName,
      surname,
      date_of_birth: dob || null,
      age: age ? Number(age) : null,
      gender,
      country,
      profession,
      registration_number: registrationNumber,
      work_setting: workSetting,
      organisation,
      platform_access_needed: platformAccess.join(", "),
    };

    const { data: existingProfile } = await supabase
      .from("healthcare_workers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    const { error } = existingProfile
      ? await supabase
          .from("healthcare_workers")
          .update(profileData)
          .eq("user_id", user.id)
      : await supabase.from("healthcare_workers").insert(profileData);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/academy");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Healthcare Worker Profile
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Complete your profile to access CareLink Academy training modules.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border px-4 py-2 text-sm font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border p-3"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              calculateAge(e.target.value);
            }}
          />

          <input
            className="rounded-xl border bg-slate-100 p-3"
            placeholder="Age"
            value={age}
            readOnly
          />

          <select
            className="rounded-xl border p-3"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>

          <select
            className="rounded-xl border p-3"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option>South Africa</option>
            <option>England</option>
            <option>Wales</option>
            <option>Scotland</option>
            <option>New Zealand</option>
          </select>

          <select
            className="rounded-xl border p-3"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          >
            <option>Doctor</option>
            <option>Nurse</option>
            <option>Psychologist</option>
            <option>Pharmacist</option>
            <option>Prescribing Pharmacist</option>
          </select>

          <input
            className="rounded-xl border p-3"
            placeholder="Professional registration number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
          />

          <select
            className="rounded-xl border p-3"
            value={workSetting}
            onChange={(e) => setWorkSetting(e.target.value)}
          >
            <option>Organisation</option>
            <option>Pharmacy</option>
            <option>Clinic</option>
            <option>Hospital</option>
            <option>GP Practice</option>
            <option>Locum</option>
          </select>

          <input
            className="rounded-xl border p-3"
            placeholder="Organisation / Pharmacy / Clinic / Locum agency"
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
          />
        </div>

        <div className="mt-4 rounded-xl border p-4">
          <p className="mb-3 font-semibold text-slate-700">
            Select Course / Platform Access
          </p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {COURSE_OPTIONS.map((course) => (
              <label key={course} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={platformAccess.includes(course)}
                  onChange={() => toggleCourse(course)}
                />
                <span>{course}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={saveProfile}
          className="mt-6 rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white"
        >
          Save and Continue
        </button>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      </div>
    </main>
  );
}
