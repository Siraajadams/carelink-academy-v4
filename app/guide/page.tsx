"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

export default function GuidePage() {
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [reviewed, setReviewed] = useState(false);
  const [reviewedAt, setReviewedAt] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmReview, setConfirmReview] = useState(false);

  const guide = {
    id: "SA-DOCTOR-ONBOARDING-GUIDE",
    title: "VideoMed Doctor Operations Guide",
    url: "https://otrhruramqmnurmdlppj.supabase.co/storage/v1/object/public/academy-documents/guides/videomed_doctor_guide.pdf",
  };

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Please login to review the onboarding guide.");
      return;
    }

    setUserId(userData.user.id);

    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .maybeSingle();

    setProfile(p);

    const { data: existing, error } = await supabase
      .from("sop_reviews")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("sop_id", guide.id)
      .maybeSingle();

    if (error) {
      setMessage(error.message);
      return;
    }

    if (existing) {
      setReviewed(true);
      setReviewedAt(new Date(existing.reviewed_at).toLocaleString());
    }
  }

  async function submitGuideReview() {
    setMessage("");

    if (!userId) {
      setMessage("Please login first.");
      return;
    }

    if (!confirmReview) {
      setMessage("Please confirm that you reviewed the onboarding guide.");
      return;
    }

    setSaving(true);

    const payload = {
      user_id: userId,
      sop_id: guide.id,
      reviewed: true,
      reviewed_at: new Date().toISOString(),
      profile_snapshot: JSON.stringify({
        full_name: profile?.full_name || "",
        email: profile?.email || "",
        role: profile?.role || "Doctor",
        country: profile?.country || "South Africa",
        document: guide.title,
      }),
    };

    const { error } = await supabase.from("sop_reviews").upsert(payload, {
      onConflict: "user_id,sop_id",
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setReviewed(true);
    setReviewedAt(new Date().toLocaleString());
    setMessage("✅ Onboarding guide reviewed and date-stamped.");
    setSaving(false);
  }

  return (
    <>
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-careblue p-8 text-white">
          <h1 className="text-3xl font-bold">SA Doctor Onboarding Guide</h1>
          <p className="mt-2 max-w-3xl text-carelight">
            South African doctors must review the VideoMed onboarding guide and
            confirm completion before final onboarding is marked complete.
          </p>
        </div>

        {message && (
          <p className="mt-6 rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
            {message}
          </p>
        )}

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <h2 className="text-2xl font-bold text-careblue">
                {guide.title}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                For: {profile?.role || "Doctor"} ·{" "}
                {profile?.country || "South Africa"}
              </p>
            </div>

            <a
              href={guide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-careblue px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Open guide
            </a>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border">
            <iframe src={guide.url} className="h-[700px] w-full" />
          </div>

          <div className="mt-6 rounded-2xl bg-carelight p-5">
            <h3 className="font-bold text-careblue">
              Onboarding Guide Confirmation
            </h3>

            <p className="mt-1 text-sm text-slate-700">
              By confirming, the doctor acknowledges that they have reviewed the
              onboarding process, platform requirements and operational guide.
            </p>

            <label className="mt-4 flex gap-3 text-sm">
              <input
                type="checkbox"
                checked={confirmReview}
                onChange={(e) => setConfirmReview(e.target.checked)}
              />
              <span>
                I confirm that I have reviewed the VideoMed Doctor Operations
                Guide.
              </span>
            </label>

            <div className="mt-6 rounded-2xl border bg-white p-5">
              <button
                type="button"
                onClick={submitGuideReview}
                disabled={saving || reviewed}
                className="w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-bold text-white shadow-sm disabled:opacity-60"
              >
                {reviewed
                  ? "✅ Guide Already Reviewed"
                  : saving
                  ? "Saving guide review..."
                  : "✅ Submit Guide Review"}
              </button>

              <p className="mt-3 text-xs text-slate-600">
                Your guide confirmation and timestamp will be stored in CareLink
                Academy.
              </p>
            </div>

            {reviewed && (
              <p className="mt-4 rounded-xl bg-green-100 p-3 text-sm font-semibold text-green-700">
                Guide reviewed on {reviewedAt}.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
