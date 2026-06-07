"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

type SOP = {
  id: string;
  sop_code: string;
  title: string;
  sop_url: string;
  country: string;
  role: string;
  is_active: boolean;
};

export default function SOPPage() {
  const [sops, setSops] = useState<SOP[]>([]);
  const [selectedSop, setSelectedSop] = useState<SOP | null>(null);
  const [reviewedMap, setReviewedMap] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState(false);
  const [reviewedAt, setReviewedAt] = useState<string | null>(null);
  const [confirmReview, setConfirmReview] = useState(false);
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSOPs();
  }, []);

  async function loadSOPs() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Please login to review SOPs.");
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(profileData);

    const role = profileData?.role || "Doctor";
    const country = profileData?.country || "South Africa";

    const { data: sopData, error: sopError } = await supabase
      .from("sops")
      .select("*")
      .eq("is_active", true)
      .eq("country", country)
      .eq("role", role)
      .neq("sop_code", "SA-DOCTOR-ONBOARDING-GUIDE")
      .order("sop_code", { ascending: true });

    if (sopError) {
      setMessage(`Unable to load SOPs: ${sopError.message}`);
      setLoading(false);
      return;
    }

    const { data: reviewData } = await supabase
      .from("sop_reviews")
      .select("sop_id, reviewed_at")
      .eq("user_id", user.id)
      .eq("reviewed", true);

    const reviewMap: Record<string, string> = {};
    reviewData?.forEach((r: any) => {
      reviewMap[r.sop_id] = r.reviewed_at;
    });

    setReviewedMap(reviewMap);
    setSops(sopData || []);

    if ((sopData || []).length > 0) {
      selectSop((sopData || [])[0], reviewMap);
    }

    setLoading(false);
  }

  function selectSop(sop: SOP, existingMap?: Record<string, string>) {
    setSelectedSop(sop);
    setConfirmReview(false);
    setMessage("");

    const mapToUse = existingMap || reviewedMap;

    if (mapToUse[sop.id]) {
      setReviewed(true);
      setReviewedAt(mapToUse[sop.id]);
    } else {
      setReviewed(false);
      setReviewedAt(null);
    }
  }

  async function confirmSOPReview() {
    if (!selectedSop) return;

    setSaving(true);
    setMessage("");

    if (!userId) {
      setMessage("You must be logged in to confirm SOP review.");
      setSaving(false);
      return;
    }

    if (!confirmReview) {
      setMessage("Please tick the confirmation checkbox before submitting.");
      setSaving(false);
      return;
    }

    const now = new Date().toISOString();

    const { error } = await supabase.from("sop_reviews").upsert(
      {
        user_id: userId,
        sop_id: selectedSop.id,
        sop_title: selectedSop.title,
        sop_code: selectedSop.sop_code,
        reviewed: true,
        reviewed_at: now,
      },
      {
        onConflict: "user_id,sop_id",
      }
    );

    if (error) {
      setMessage(`Could not save review: ${error.message}`);
      setSaving(false);
      return;
    }

    const updatedMap = {
      ...reviewedMap,
      [selectedSop.id]: now,
    };

    setReviewed(true);
    setReviewedAt(now);
    setReviewedMap(updatedMap);
    setConfirmReview(false);
    setMessage("✅ SOP review recorded successfully and date-stamped.");
    setSaving(false);
  }

  const reviewedCount = Object.keys(reviewedMap).filter((id) =>
    sops.some((s) => s.id === id)
  ).length;

  const progress =
    sops.length > 0 ? Math.round((reviewedCount / sops.length) * 100) : 0;

  return (
    <>
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-careblue p-8 text-white">
          <h1 className="text-3xl font-bold">Standard Operating Procedures</h1>
          <p className="mt-2 max-w-3xl text-carelight">
            Review each South African doctor SOP and submit a confirmation. Each
            confirmation is date-stamped and stored in CareLink Academy.
          </p>
        </div>

        {message && (
          <p className="mt-6 rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
            {message}
          </p>
        )}

        {loading ? (
          <p className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
            Loading SOPs...
          </p>
        ) : (
          <>
            <section className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Assigned SOPs</p>
                <h2 className="mt-2 text-2xl font-bold">{sops.length}</h2>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Reviewed</p>
                <h2 className="mt-2 text-2xl font-bold">
                  {reviewedCount}/{sops.length}
                </h2>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Progress</p>
                <h2 className="mt-2 text-2xl font-bold">{progress}%</h2>
              </div>
            </section>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <section className="rounded-3xl bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold">Assigned SOPs</h2>

                <div className="mt-4 space-y-3">
                  {sops.length === 0 && (
                    <p className="text-sm text-slate-600">
                      No SOPs found. Please check the SOP records in Supabase.
                    </p>
                  )}

                  {sops.map((sop) => (
                    <button
                      key={sop.id}
                      onClick={() => selectSop(sop)}
                      className={`w-full rounded-2xl border p-4 text-left ${
                        selectedSop?.id === sop.id
                          ? "border-careblue bg-carelight"
                          : ""
                      }`}
                    >
                      <p className="font-bold">{sop.sop_code}</p>
                      <p className="text-sm text-slate-700">{sop.title}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {reviewedMap[sop.id]
                          ? `Reviewed on ${new Date(
                              reviewedMap[sop.id]
                            ).toLocaleString()}`
                          : "Awaiting review"}
                      </p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl bg-white p-5 shadow-sm md:col-span-2">
                {selectedSop ? (
                  <>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-careblue">
                          {selectedSop.title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {selectedSop.sop_code} · {selectedSop.role} ·{" "}
                          {selectedSop.country}
                        </p>
                      </div>

                      <a
                        href={selectedSop.sop_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-careblue px-4 py-3 text-center text-sm font-semibold text-white"
                      >
                        Open SOP
                      </a>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border">
                      {selectedSop.sop_url?.startsWith("http") ? (
                        <iframe
                          src={`${selectedSop.sop_url}#toolbar=1&navpanes=0`}
                          className="h-[750px] w-full"
                          title={selectedSop.title}
                        />
                      ) : (
                        <div className="bg-slate-50 p-6 text-sm text-slate-700">
                          <p className="font-semibold">
                            SOP document URL not configured correctly.
                          </p>
                          <p className="mt-2">
                            Please update the <strong>sop_url</strong> field in
                            Supabase with the full public PDF URL.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 rounded-2xl bg-carelight p-5">
                      <h3 className="font-bold text-careblue">
                        SOP Review Confirmation
                      </h3>

                      <p className="mt-1 text-sm text-slate-700">
                        Please review the full SOP before submitting your
                        confirmation.
                      </p>

                      {!reviewed && (
                        <>
                          <label className="mt-4 flex gap-3 text-sm">
                            <input
                              type="checkbox"
                              checked={confirmReview}
                              onChange={(e) =>
                                setConfirmReview(e.target.checked)
                              }
                            />
                            <span>
                              I confirm that I have reviewed and understood this
                              SOP.
                            </span>
                          </label>

                          <div className="mt-6 rounded-2xl border bg-white p-5">
                            <button
                              type="button"
                              onClick={confirmSOPReview}
                              disabled={saving}
                              className="w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-bold text-white shadow-sm disabled:opacity-60"
                            >
                              {saving
                                ? "Saving SOP review..."
                                : "✅ Submit SOP Review"}
                            </button>

                            <p className="mt-3 text-xs text-slate-600">
                              Your SOP review and timestamp will be stored in
                              CareLink Academy.
                            </p>
                          </div>
                        </>
                      )}

                      {reviewed && (
                        <p className="mt-4 rounded-xl bg-green-100 p-3 text-sm font-semibold text-green-700">
                          ✓ SOP reviewed successfully
                          {reviewedAt && (
                            <>
                              <br />
                              Reviewed on:{" "}
                              {new Date(reviewedAt).toLocaleString()}
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p>Select an SOP to review.</p>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </>
  );
}
