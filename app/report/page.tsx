"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

export default function ReportPage() {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [sopReviews, setSopReviews] = useState<any[]>([]);
  const [totalSops, setTotalSops] = useState(0);
  const [guideReview, setGuideReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const guideId = "SA-DOCTOR-ONBOARDING-GUIDE";

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
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

    const { data: pr } = await supabase
      .from("progress")
      .select("*, modules(title)")
      .eq("user_id", user.id);

    const { data: a } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: c } = await supabase
      .from("contract_signatures")
      .select("*, contracts(title, version)")
      .eq("user_id", user.id)
      .order("signed_at", { ascending: false });

    const { data: guide } = await supabase
      .from("sop_reviews")
      .select("*")
      .eq("user_id", user.id)
      .eq("sop_id", guideId)
      .maybeSingle();

    const { data: sopReviewData } = await supabase
      .from("sop_reviews")
      .select("*")
      .eq("user_id", user.id)
      .eq("reviewed", true)
      .neq("sop_id", guideId)
      .order("reviewed_at", { ascending: false });

    const { count: sopTotalCount } = await supabase
      .from("sops")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("country", country)
      .eq("role", role)
      .neq("sop_code", guideId);

    setProgress(pr || []);
    setAssessments(a || []);
    setContracts(c || []);
    setGuideReview(guide || null);
    setSopReviews(sopReviewData || []);
    setTotalSops(sopTotalCount || 0);

    setLoading(false);
  }

  const completedModules = progress.filter((p) => p.completed);
  const sopCompleted = sopReviews.length;
  const sopProgress =
    totalSops > 0 ? Math.round((sopCompleted / totalSops) * 100) : 0;

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
            <p className="mt-6 rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
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
                  <p className="text-sm text-slate-600">Modules</p>
                  <p className="text-2xl font-bold">{completedModules.length}</p>
                </div>

                <div className="rounded-2xl border p-5">
                  <p className="text-sm text-slate-600">Contracts</p>
                  <p className="text-2xl font-bold">{contracts.length}</p>
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
                    {sopCompleted}/{totalSops}
                  </p>
                </div>
              </div>

              <h2 className="mt-8 text-xl font-bold">Completed Modules</h2>
              <ul className="mt-3 space-y-2">
                {completedModules.length === 0 && (
                  <li className="rounded-xl border p-3">
                    No modules completed yet.
                  </li>
                )}

                {completedModules.map((p) => (
                  <li key={p.module_id} className="rounded-xl border p-3">
                    {p.modules?.title || "Completed module"}
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 text-xl font-bold">Assessments</h2>
              <ul className="mt-3 space-y-2">
                {assessments.length === 0 && (
                  <li className="rounded-xl border p-3">
                    No assessments completed yet.
                  </li>
                )}

                {assessments.map((a) => (
                  <li key={a.id} className="rounded-xl border p-3">
                    {a.assessment_name || "Assessment"}:{" "}
                    <strong>{a.score}%</strong> —{" "}
                    {a.passed ? "Passed" : "Not passed"}
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 text-xl font-bold">Contract Sign-off</h2>
              <ul className="mt-3 space-y-2">
                {contracts.length === 0 && (
                  <li className="rounded-xl border p-3">
                    No contract signed yet.
                  </li>
                )}

                {contracts.map((c) => (
                  <li key={c.id} className="rounded-xl border p-3">
                    {c.contracts?.title || "Contract"} v
                    {c.contracts?.version || "1.0"}:{" "}
                    <strong>Signed</strong> by {c.signer_name || "User"} on{" "}
                    {c.signed_at
                      ? new Date(c.signed_at).toLocaleString()
                      : "date unavailable"}
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 text-xl font-bold">Doctor Onboarding Guide</h2>
              <div className="mt-3 rounded-xl border p-3">
                {guideReview ? (
                  <p>
                    ✅ VideoMed Doctor Operations Guide reviewed on{" "}
                    {new Date(guideReview.reviewed_at).toLocaleString()}.
                  </p>
                ) : (
                  <p>Guide not reviewed yet.</p>
                )}
              </div>

              <h2 className="mt-8 text-xl font-bold">SOP Reviews</h2>
              <div className="mt-3 rounded-xl border p-4">
                <p className="font-semibold">
                  {sopCompleted}/{totalSops} SOPs reviewed — {sopProgress}%
                </p>

                <div className="mt-3 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-careblue"
                    style={{ width: `${sopProgress}%` }}
                  />
                </div>

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
                        {sop.reviewed_at
                          ? new Date(sop.reviewed_at).toLocaleString()
                          : "date unavailable"}
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
