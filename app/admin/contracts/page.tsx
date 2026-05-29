 "use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

const roles = ["All", "Doctor", "Pharmacist", "Nurse", "Counsellor", "Psychologist", "Pharmacy Assistant", "Admin"];
const countries = ["Global", "England", "Wales", "Scotland", "South Africa", "New Zealand"];

export default function AdminContractsPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    role: "Doctor",
    country: "South Africa",
    version: "1.0",
    contract_url: ""
  });
  const [message, setMessage] = useState("");

  async function save() {
    setMessage("");
    const { error } = await supabase.from("contracts").insert({
      ...form,
      is_active: true
    });
    setMessage(error ? error.message : "Contract template added.");
  }

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-careblue">Admin: Add Contract Template</h1>
          <p className="mt-2 text-sm text-slate-600">
            Add a contract URL from Google Drive, Supabase Storage, or your public documents folder.
            Use PDF for best browser preview.
          </p>

          <div className="mt-6 grid gap-4">
            <input className="rounded-xl border p-3" placeholder="Contract title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <textarea className="rounded-xl border p-3" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <div className="grid gap-4 md:grid-cols-3">
              <select className="rounded-xl border p-3" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
              <select className="rounded-xl border p-3" value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="rounded-xl border p-3" placeholder="Version" value={form.version} onChange={e => setForm({...form, version: e.target.value})} />
            </div>
            <input className="rounded-xl border p-3" placeholder="Contract URL" value={form.contract_url} onChange={e => setForm({...form, contract_url: e.target.value})} />
          </div>

          <button onClick={save} className="mt-6 rounded-xl bg-careblue px-6 py-3 font-semibold text-white">Add contract</button>
          {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
        </div>
      </main>
    </>
  );
}
