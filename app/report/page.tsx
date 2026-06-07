"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

const GUIDE_ID = "SA-DOCTOR-ONBOARDING-GUIDE";

export default function ReportPage() {
  const [profile, setProfile] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [contractSignatures, setContractSignatures] = useState<any[]>([]);
  const [sops, setSops] = useState<any[]>([]);
  const [sopReviews, setSopReviews] = useState<any[]>([]);
  const [guideReview, setGuideReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login to view your report.");
      setLoading(false);
      return;
    }

    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(p);

    const role = p?.role || "Doctor";
    const country = p?.country || "South Africa";

    const { data: activeContracts } = await supabase
      .from("contracts")
      .select("*")
      .eq("is_active", true)
      .eq("role", role)
      .eq("country", country);

    const { data: signedContracts } = await supabase
      .from("contract_signatures")
      .select("*")
      .eq("user_id", user.id);

    const { data: activeSops } = await supabase
      .from("sops")
      .select("*")
      .eq("is_active", true)
      .eq("role", role)
      .eq("country", country)
      .neq("sop_code", GUIDE_ID)
      .order("sop_code", { ascending: true });

    const { data: reviews } = await supabase
      .from("sop_reviews")
      .select("*")
      .eq("user_id", user.id)
      .eq("reviewed", true);

    const guide = reviews?.find((r: any) => r.sop_id === GUIDE_ID);
    const sopOnlyReviews =
      reviews?.filter((r: any) => r.sop_id !== GUIDE_ID) || [];

    setContracts(activeContracts || []);
    setContractSignatures(signedContracts || []);
    setSops(activeSops || []);
    setSopReviews(sopOnlyReviews);
    setGuideReview(guide || null);

    setLoading(false);
  }

  const signedCount = contractSignatures.length;
  const contractTotal = contracts.length;
  const sopReviewedCount = sopReviews.length;
  const sopTotal = sops.length;

  const totalSteps = contractTotal + sopTotal + 1;
  const completedSteps =
    signedCount + sopReviewedCount + (guideReview ? 1 : 0);

  const overallProgress =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <>
      <TopNav />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-careblue">
            Knowledge Report
          </h1>

          {loading && <p className="mt-6">Loading report...</p>}

          {!loading && message && (
            <p className="mt-6 rounded-2xl bg-yellow-50 p-4 text-yellow-800">
              {message}
            </p>
          )}

          {!loading && !message && (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-carelight p-5">
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="font-bold">
                    {profile?.full_name || "Not completed"}
                  </p>
                </div>

                <div className="rounded-2xl bg-carelight p-5">
                  <p className="text-sm text-slate-600">Role / Country</p>
                  <p className="font-bold">
                    {profile?.role || "Doctor"} —{" "}
                    {profile?.country || "South Africa"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border p-5">
                  <p className="text-sm text-slate-600">Contracts</p>
                  <p className="text-2xl font-bold">
                    {signedCount}/{contractTotal}
                  </p>
                </div>

                <div className="rounded-2xl border p-5">
                  <p className="text-sm text-slate-600">Guide</p>
                  <p className="text-2xl font-bold">
                    {guideReview ? "Done" : "Pending"}
                  </p>
                </div>

                <div className="rounded-2xl border p-5">
                  <p className="text-sm text-slate-600">SOPs</p>
                  <p className="text-2xl font-bold">
                    {sopReviewedCount}/{sopTotal}
                  </p>
                </div>

                <div className="rounded-2xl border p-5">
                  <p className="text-sm text-slate-600">Overall</p>
                  <p className="text-2xl font-bold">{overallProgress}%</p>
                </div>
              </div>

              <h2 className="mt-8 text-xl font-bold">Contract Sign-off</h2>
              <ul className="mt-3 space-y-2">
                {contractSignatures.length === 0 && (
                  <li className="rounded-xl border p-3">
                    No contract signed yet.
                  </li>
                )}

                {contractSignatures.map((c) => (
                  <li key={c.id} className="rounded-xl border p-3">
                    ✅ Contract signed by {c.signer_name || "User"}
                    <br />
                    <span className="text-sm text-slate-600">
                      {c.signed_at || c.created_at
                        ? new Date(c.signed_at || c.created_at).toLocaleString()
                        : "Date unavailable"}
                    </span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 text-xl font-bold">Doctor Onboarding Guide</h2>
              <div className="mt-3 rounded-xl border p-3">
                {guideReview ? (
                  <p>
                    ✅ Guide reviewed on{" "}
                    {new Date(guideReview.reviewed_at).toLocaleString()}.
                  </p>
                ) : (
                  <p>Guide not reviewed yet.</p>
                )}
              </div>

              <h2 className="mt-8 text-xl font-bold">SOP Reviews</h2>
              <div className="mt-3 rounded-xl border p-4">
                <p className="font-semibold">
                  {sopReviewedCount}/{sopTotal} SOPs reviewed
                </p>

                <ul className="mt-4 space-y-2">
                  {sopReviews.length === 0 && (
                    <li className="rounded-xl bg-slate-50 p-3">
                      No SOPs reviewed yet.
                    </li>
                  )}

                  {sopReviews.map((sop) => (
                    <li key={sop.id} className="rounded-xl bg-slate-50 p-3">
                      ✅ {sop.sop_title || sop.sop_code || "SOP reviewed"}
                      <br />
                      <span className="text-sm text-slate-600">
                        Reviewed on{" "}
                        {new Date(sop.reviewed_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => window.print()}
                className="mt-8 rounded-xl bg-careblue px-6 py-3 font-semibold text-white"
              >
                Print / Save as PDF
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
