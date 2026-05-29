"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ReportPage() {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      const { data: pr } = await supabase.from("progress").select("*, modules(title)").eq("user_id", data.user.id);
      const { data: a } = await supabase.from("assessments").select("*").eq("user_id", data.user.id).order("created_at", { ascending: false });
      const { data: c } = await supabase.from("contract_signatures").select("*, contracts(title, version)").eq("user_id", data.user.id).order("signed_at", { ascending: false });

      setProfile(p);
      setProgress(pr || []);
      setAssessments(a || []);
      setContracts(c || []);
    }
    load();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-careblue">Knowledge Report</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-carelight p-5">
            <p className="text-sm text-slate-600">Name</p>
            <p className="font-bold">{profile?.full_name || "Not completed"}</p>
          </div>
          <div className="rounded-2xl bg-carelight p-5">
            <p className="text-sm text-slate-600">Role / Country</p>
            <p className="font-bold">{profile?.role} — {profile?.country}</p>
          </div>
        </div>

        <h2 className="mt-8 text-xl font-bold">Completed Modules</h2>
        <ul className="mt-3 space-y-2">
          {progress.filter(p => p.completed).map(p => (
            <li key={p.module_id} className="rounded-xl border p-3">{p.modules?.title}</li>
          ))}
        </ul>

        <h2 className="mt-8 text-xl font-bold">Assessments</h2>
        <ul className="mt-3 space-y-2">
          {assessments.map(a => (
            <li key={a.id} className="rounded-xl border p-3">
              {a.assessment_name}: <strong>{a.score}%</strong> — {a.passed ? "Passed" : "Not passed"}
            </li>
          ))}
        </ul>


        <h2 className="mt-8 text-xl font-bold">Contract Sign-off</h2>
        <ul className="mt-3 space-y-2">
          {contracts.length === 0 && <li className="rounded-xl border p-3">No contract signed yet.</li>}
          {contracts.map(c => (
            <li key={c.id} className="rounded-xl border p-3">
              {c.contracts?.title} v{c.contracts?.version}: <strong>Signed</strong> by {c.signer_name} on {new Date(c.signed_at).toLocaleDateString()}
            </li>
          ))}
        </ul>

        <button onClick={() => window.print()} className="mt-8 rounded-xl bg-careblue px-6 py-3 font-semibold text-white">
          Print / Save as PDF
        </button>
      </div>
    </main>
  );
}
