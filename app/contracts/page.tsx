 "use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

type Contract = {
  id: string;
  title: string;
  role: string;
  country: string;
  contract_url: string;
  version: string;
  description: string;
};

type Signature = {
  contract_id: string;
  accepted: boolean;
  signer_name: string;
  signature_text: string;
  signed_at: string;
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [signatures, setSignatures] = useState<Record<string, Signature>>({});
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [active, setActive] = useState<Contract | null>(null);
  const [form, setForm] = useState({
    signer_name: "",
    signature_text: "",
    identity_or_registration_number: "",
    email: "",
    mobile: "",
    accepted_terms: false
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setUserId(userData.user.id);

      const { data: p } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single();
      setProfile(p);
      setForm(f => ({ ...f, signer_name: p?.full_name || "" }));

      const country = p?.country || "South Africa";
      const role = p?.role || "Doctor";

      const { data: contractData } = await supabase
        .from("contracts")
        .select("*")
        .eq("is_active", true)
        .or(`country.eq.Global,country.eq.${country}`)
        .or(`role.eq.All,role.eq.${role}`)
        .order("created_at", { ascending: false });

      const { data: sigData } = await supabase.from("contract_signatures").select("*").eq("user_id", userData.user.id);

      const sigMap: Record<string, Signature> = {};
      sigData?.forEach((s: any) => sigMap[s.contract_id] = s);

      setContracts(contractData || []);
      setSignatures(sigMap);
      if ((contractData || []).length) setActive((contractData || [])[0]);
    }
    load();
  }, []);

  async function signContract() {
    setMessage("");
    if (!active) return;
    if (!form.accepted_terms) {
      setMessage("Please tick the confirmation checkbox before signing.");
      return;
    }
    if (!form.signer_name || !form.signature_text) {
      setMessage("Please enter your full name and type your signature.");
      return;
    }

    const payload = {
      user_id: userId,
      contract_id: active.id,
      signer_name: form.signer_name,
      signature_text: form.signature_text,
      identity_or_registration_number: form.identity_or_registration_number,
      email: form.email,
      mobile: form.mobile,
      accepted: true,
      ip_acknowledgement: "User confirmed contract review and electronic sign-off inside CareLink Academy.",
      signed_at: new Date().toISOString()
    };

    const { error } = await supabase.from("contract_signatures").upsert(payload, {
      onConflict: "user_id,contract_id"
    });

    if (error) setMessage(error.message);
    else {
      setSignatures({ ...signatures, [active.id]: payload as any });
      setMessage("Contract signed and recorded.");
    }
  }

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-careblue p-8 text-white">
          <h1 className="text-3xl font-bold">Contract Review & Sign-off</h1>
          <p className="mt-2 max-w-3xl text-carelight">
            Review your assigned contract, confirm that you understand it, and sign electronically.
            Future contract templates can be loaded for pharmacists, nurses, psychologists and other healthcare workers.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Assigned contracts</h2>
            <div className="mt-4 space-y-3">
              {contracts.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActive(c)}
                  className={`w-full rounded-2xl border p-4 text-left ${active?.id === c.id ? "border-careblue bg-carelight" : ""}`}
                >
                  <p className="font-bold">{c.title}</p>
                  <p className="text-xs text-slate-600">{c.role} · {c.country} · v{c.version}</p>
                  <p className="mt-1 text-xs">{signatures[c.id]?.accepted ? "Signed" : "Awaiting sign-off"}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="md:col-span-2 rounded-3xl bg-white p-5 shadow-sm">
            {active ? (
              <>
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-careblue">{active.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{active.description}</p>
                    <p className="mt-1 text-xs text-slate-500">For: {profile?.role || active.role} · {profile?.country || active.country}</p>
                  </div>
                  <a href={active.contract_url} target="_blank" className="rounded-xl bg-careblue px-4 py-3 text-center text-sm font-semibold text-white">
                    Open contract
                  </a>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border">
                  {active.contract_url?.toLowerCase().endsWith(".pdf") ? (
                    <iframe src={active.contract_url} className="h-[520px] w-full" />
                  ) : (
                    <div className="bg-slate-50 p-6 text-sm text-slate-700">
                      <p className="font-semibold">Document preview</p>
                      <p className="mt-2">
                        This contract is a Word document. Click “Open contract” to review it.
                        For production, save final contracts as PDF for browser preview.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 rounded-2xl bg-carelight p-5">
                  <h3 className="font-bold text-careblue">Electronic sign-off</h3>
                  <p className="mt-1 text-sm text-slate-700">
                    By signing, the healthcare worker confirms that they have reviewed the contract, understand the onboarding obligations, and accept electronic sign-off.
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <input className="rounded-xl border p-3" placeholder="Full name" value={form.signer_name} onChange={e => setForm({...form, signer_name: e.target.value})} />
                    <input className="rounded-xl border p-3" placeholder="Registration / ID number" value={form.identity_or_registration_number} onChange={e => setForm({...form, identity_or_registration_number: e.target.value})} />
                    <input className="rounded-xl border p-3" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    <input className="rounded-xl border p-3" placeholder="Mobile" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
                    <input className="rounded-xl border p-3 md:col-span-2" placeholder="Type your full name as signature" value={form.signature_text} onChange={e => setForm({...form, signature_text: e.target.value})} />
                  </div>

                  <label className="mt-4 flex gap-3 text-sm">
                    <input type="checkbox" checked={form.accepted_terms} onChange={e => setForm({...form, accepted_terms: e.target.checked})} />
                    <span>I confirm that I have reviewed this contract and agree to sign electronically.</span>
                  </label>

                  <button onClick={signContract} className="mt-5 rounded-xl bg-careblue px-6 py-3 font-semibold text-white">
                    Sign and submit
                  </button>

                  {signatures[active.id]?.accepted && (
                    <p className="mt-4 rounded-xl bg-green-100 p-3 text-sm font-semibold text-green-700">
                      Signed by {signatures[active.id].signer_name} on {new Date(signatures[active.id].signed_at).toLocaleString()}.
                    </p>
                  )}

                  {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
                </div>
              </>
            ) : (
              <p>No contract assigned yet.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
