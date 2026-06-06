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
  review_confirmed?: boolean;
  review_confirmed_at?: string;
  country?: string;
  role?: string;
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [signatures, setSignatures] = useState<Record<string, Signature>>({});
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [active, setActive] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [canConfirmReview, setCanConfirmReview] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    signer_name: "",
    signature_text: "",
    identity_or_registration_number: "",
    email: "",
    mobile: "",
    accepted_terms: false,
    review_confirmed: false,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setLoading(false);
        return;
      }

      setUserId(userData.user.id);

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      setProfile(p);

      setForm((f) => ({
        ...f,
        signer_name: p?.full_name || "",
        email: p?.email || userData.user?.email || "",
        mobile: p?.mobile || p?.phone || "",
        identity_or_registration_number:
          p?.hpcsa_number ||
          p?.registration_number ||
          p?.identity_or_registration_number ||
          "",
      }));

      const country = p?.country || "South Africa";
      const role = p?.role || "Doctor";

      const isSouthAfricanDoctor =
        country.toLowerCase() === "south africa" &&
        role.toLowerCase().includes("doctor");

      if (!isSouthAfricanDoctor) {
        setContracts([]);
        setActive(null);
        setMessage(
          "No South African doctor contracts are assigned to this profile."
        );
        setLoading(false);
        return;
      }

      const { data: contractData, error: contractError } = await supabase
        .from("contracts")
        .select("*")
        .eq("is_active", true)
        .or(`country.eq.Global,country.eq.${country}`)
        .or(`role.eq.All,role.eq.${role}`)
        .order("created_at", { ascending: false });

      if (contractError) {
        setMessage(contractError.message);
        setLoading(false);
        return;
      }

      const { data: sigData } = await supabase
        .from("contract_signatures")
        .select("*")
        .eq("user_id", userData.user.id);

      const sigMap: Record<string, Signature> = {};

      sigData?.forEach((s: any) => {
        sigMap[s.contract_id] = s;
      });

      setContracts(contractData || []);
      setSignatures(sigMap);

      if ((contractData || []).length) {
        setActive((contractData || [])[0]);
      }

      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    setCanConfirmReview(false);

    const timer = setTimeout(() => {
      const previewBox = document.getElementById("contract-preview-box");

      if (!previewBox) return;

      function handleScroll() {
        const el = previewBox as HTMLElement;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;

        if (nearBottom) {
          setCanConfirmReview(true);
        }
      }

      previewBox.addEventListener("scroll", handleScroll);

      return () => {
        previewBox.removeEventListener("scroll", handleScroll);
      };
    }, 300);

    return () => clearTimeout(timer);
  }, [active?.id]);

  function selectContract(contract: Contract) {
    setActive(contract);
    setMessage("");
    setCanConfirmReview(false);

    setForm((f) => ({
      ...f,
      accepted_terms: false,
      review_confirmed: false,
    }));
  }

  async function signContract() {
    setMessage("");

    if (!active) return;

    if (!userId) {
      setMessage("Please login before signing.");
      return;
    }

    if (!form.review_confirmed) {
      setMessage("Please confirm that you have reviewed the contract first.");
      return;
    }

    if (!form.accepted_terms) {
      setMessage("Please tick the electronic sign-off checkbox before signing.");
      return;
    }

    if (!form.signer_name || !form.signature_text) {
      setMessage("Please enter your full name and type your signature.");
      return;
    }

    const signedNow = new Date().toISOString();

    const payload = {
      user_id: userId,
      contract_id: active.id,
      signer_name: form.signer_name,
      signature_text: form.signature_text,
      identity_or_registration_number: form.identity_or_registration_number,
      email: form.email,
      mobile: form.mobile,
      accepted: true,
      review_confirmed: true,
      review_confirmed_at: signedNow,
      country: profile?.country || "South Africa",
      role: profile?.role || "Doctor",
      ip_acknowledgement:
        "User confirmed full contract review and completed electronic sign-off inside CareLink Academy.",
      signed_at: signedNow,
    };

    const { error } = await supabase.from("contract_signatures").upsert(payload, {
      onConflict: "user_id,contract_id",
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setSignatures({
      ...signatures,
      [active.id]: payload as any,
    });

    setMessage("Contract reviewed, signed and date-stamped successfully.");
  }

  return (
    <>
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-careblue p-8 text-white">
          <h1 className="text-3xl font-bold">Contract Review & Sign-off</h1>

          <p className="mt-2 max-w-3xl text-carelight">
            Review your assigned South African doctor contract, confirm that you
            understand it, and sign electronically. The confirmation is
            date-stamped and stored for compliance.
          </p>
        </div>

        {loading && (
          <p className="mt-6 rounded-2xl bg-white p-5 text-sm shadow-sm">
            Loading assigned contracts...
          </p>
        )}

        {!loading && message && !active && (
          <p className="mt-6 rounded-2xl bg-yellow-50 p-5 text-sm text-yellow-800">
            {message}
          </p>
        )}

        {!loading && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">Assigned contracts</h2>

              <div className="mt-4 space-y-3">
                {contracts.length === 0 && (
                  <p className="text-sm text-slate-600">
                    No contract assigned yet.
                  </p>
                )}

                {contracts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectContract(c)}
                    className={`w-full rounded-2xl border p-4 text-left ${
                      active?.id === c.id ? "border-careblue bg-carelight" : ""
                    }`}
                  >
                    <p className="font-bold">{c.title}</p>

                    <p className="text-xs text-slate-600">
                      {c.role} · {c.country} · v{c.version}
                    </p>

                    <p className="mt-1 text-xs">
                      {signatures[c.id]?.accepted
                        ? "Signed and date-stamped"
                        : "Awaiting review and sign-off"}
                    </p>

                    {signatures[c.id]?.accepted && (
                      <p className="mt-1 text-xs text-green-700">
                        {new Date(
                          signatures[c.id].review_confirmed_at ||
                            signatures[c.id].signed_at
                        ).toLocaleString()}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-sm md:col-span-2">
              {active ? (
                <>
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-careblue">
                        {active.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        {active.description}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        For: {profile?.role || active.role} ·{" "}
                        {profile?.country || active.country}
                      </p>
                    </div>

                    <a
                      href={active.contract_url}
                      target="_blank"
                      className="rounded-xl bg-careblue px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Open contract
                    </a>
                  </div>

                  <div
                    id="contract-preview-box"
                    className="mt-5 max-h-[650px] overflow-y-auto rounded-2xl border"
                  >
                    {active.contract_url?.toLowerCase().endsWith(".pdf") ? (
                      <iframe
                        src={active.contract_url}
                        className="h-[650px] w-full"
                      />
                    ) : (
                      <div className="bg-slate-50 p-6 text-sm text-slate-700">
                        <p className="font-semibold">Document preview</p>

                        <p className="mt-2">
                          This contract is a Word document. Click “Open
                          contract” to review it. For production, save final
                          contracts as PDF for browser preview.
                        </p>

                        <div className="mt-8 h-[520px] rounded-xl bg-white p-5 text-slate-600">
                          Scroll to the bottom of this box after reviewing the
                          document externally, then complete the confirmation
                          below.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 rounded-2xl bg-carelight p-5">
                    <h3 className="font-bold text-careblue">
                      Electronic sign-off
                    </h3>

                    <p className="mt-1 text-sm text-slate-700">
                      By signing, the healthcare worker confirms that they have
                      reviewed the contract, understand the onboarding
                      obligations, and accept electronic sign-off.
                    </p>

                    <div className="mt-4 rounded-xl border bg-white p-4">
                      <label className="flex gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={form.review_confirmed}
                          disabled={!canConfirmReview}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              review_confirmed: e.target.checked,
                            })
                          }
                        />

                        <span>
                          I confirm that I have reviewed the full contract and
                          understand my obligations.
                        </span>
                      </label>

                      {!canConfirmReview && !signatures[active.id]?.accepted && (
                        <p className="mt-2 text-xs text-slate-500">
                          Please scroll to the bottom of the contract preview
                          before confirming review.
                        </p>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <input
                        className="rounded-xl border p-3"
                        placeholder="Full name"
                        value={form.signer_name}
                        onChange={(e) =>
                          setForm({ ...form, signer_name: e.target.value })
                        }
                      />

                      <input
                        className="rounded-xl border p-3"
                        placeholder="Registration / ID number"
                        value={form.identity_or_registration_number}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            identity_or_registration_number: e.target.value,
                          })
                        }
                      />

                      <input
                        className="rounded-xl border p-3"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />

                      <input
                        className="rounded-xl border p-3"
                        placeholder="Mobile"
                        value={form.mobile}
                        onChange={(e) =>
                          setForm({ ...form, mobile: e.target.value })
                        }
                      />

                      <input
                        className="rounded-xl border p-3 md:col-span-2"
                        placeholder="Type your full name as signature"
                        value={form.signature_text}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            signature_text: e.target.value,
                          })
                        }
                      />
                    </div>

                    <label className="mt-4 flex gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={form.accepted_terms}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            accepted_terms: e.target.checked,
                          })
                        }
                      />

                      <span>
                        I confirm that I agree to sign this contract
                        electronically.
                      </span>
                    </label>

                    <button
                      onClick={signContract}
                      className="mt-5 rounded-xl bg-careblue px-6 py-3 font-semibold text-white"
                    >
                      Sign and submit
                    </button>

                    {signatures[active.id]?.accepted && (
                      <p className="mt-4 rounded-xl bg-green-100 p-3 text-sm font-semibold text-green-700">
                        Signed by {signatures[active.id].signer_name} on{" "}
                        {new Date(
                          signatures[active.id].signed_at
                        ).toLocaleString()}
                        .
                        <br />
                        Reviewed on{" "}
                        {new Date(
                          signatures[active.id].review_confirmed_at ||
                            signatures[active.id].signed_at
                        ).toLocaleString()}
                        .
                      </p>
                    )}

                    {message && (
                      <p className="mt-4 text-sm text-slate-700">{message}</p>
                    )}
                  </div>
                </>
              ) : (
                <p>No contract assigned yet.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}
