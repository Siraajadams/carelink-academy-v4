"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

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
  const [platformAccess, setPlatformAccess] = useState("CareLink, Videomed, CPNBS");
  const [message, setMessage] = useState("");

  function calculateAge(date: string) {
    const birth = new Date(date);
    const today = new Date();
    let calculated = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) calculated--;

    setAge(String(calculated));
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

    const { error } = await supabase.from("healthcare_workers").upsert({
      user_id: user.id,
      email: user.email,
      first_name: firstName,
      surname,
      date_of_birth: dob,
      age: Number(age),
      gender,
      country,
      profession,
      registration_number: registrationNumber,
      work_setting: workSetting,
      organisation,
      platform_access_needed: platformAccess,
    });

    if (error) setMessage(error.message);
    else router.push("/academy");
  }

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          Healthcare Worker Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-3 rounded-xl" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input className="border p-3 rounded-xl" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />

          <input
            className="border p-3 rounded-xl"
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              calculateAge(e.target.value);
            }}
          />

          <input className="border p-3 rounded-xl bg-slate-100" placeholder="Age" value={age} readOnly />

          <select className="border p-3 rounded-xl" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>

          <select className="border p-3 rounded-xl" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option>South Africa</option>
            <option>England</option>
            <option>Wales</option>
            <option>Scotland</option>
            <option>New Zealand</option>
          </select>

          <select className="border p-3 rounded-xl" value={profession} onChange={(e) => setProfession(e.target.value)}>
            <option>Doctor</option>
            <option>Nurse</option>
            <option>Psychologist</option>
            <option>Pharmacist</option>
            <option>Prescribing Pharmacist</option>
          </select>

          <input className="border p-3 rounded-xl" placeholder="Professional registration number" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />

          <select className="border p-3 rounded-xl" value={workSetting} onChange={(e) => setWorkSetting(e.target.value)}>
            <option>Organisation</option>
            <option>Pharmacy</option>
            <option>Clinic</option>
            <option>Locum</option>
          </select>

          <input className="border p-3 rounded-xl" placeholder="Organisation / Pharmacy / Clinic" value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
        </div>

        <input
          className="border p-3 rounded-xl w-full mt-4"
          placeholder="Platform access needed"
          value={platformAccess}
          onChange={(e) => setPlatformAccess(e.target.value)}
        />

        <button onClick={saveProfile} className="mt-6 bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold">
          Save and Continue
        </button>

        {message && <p className="text-red-600 text-sm mt-4">{message}</p>}
      </div>
    </main>
  );
}
