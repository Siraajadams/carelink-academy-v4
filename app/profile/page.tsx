"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const countries = ["England", "Wales", "Scotland", "South Africa", "New Zealand"];
const roles = ["Doctor", "Pharmacist", "Nurse", "Counsellor", "Psychologist", "Pharmacy Assistant", "Admin"];

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    country: "South Africa",
    role: "Pharmacist",
    registration_number: "",
    organisation: "",
    platform_access_needed: "CareLink, Videomed, CPNBS"
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else setUserId(data.user.id);
    });
  }, [router]);

  async function saveProfile() {
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      ...form,
      updated_at: new Date().toISOString()
    });
    if (error) setMessage(error.message);
    else router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-careblue">Healthcare Worker Profile</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border p-3" placeholder="Full name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
          <input className="rounded-xl border p-3" placeholder="Professional registration number" value={form.registration_number} onChange={e => setForm({...form, registration_number: e.target.value})} />
          <select className="rounded-xl border p-3" value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-xl border p-3" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
          <input className="rounded-xl border p-3 md:col-span-2" placeholder="Organisation / pharmacy / clinic" value={form.organisation} onChange={e => setForm({...form, organisation: e.target.value})} />
          <input className="rounded-xl border p-3 md:col-span-2" placeholder="Platform access needed" value={form.platform_access_needed} onChange={e => setForm({...form, platform_access_needed: e.target.value})} />
        </div>
        <button onClick={saveProfile} className="mt-6 rounded-xl bg-careblue px-6 py-3 font-semibold text-white">Save and continue</button>
        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      </div>
    </main>
  );
}
