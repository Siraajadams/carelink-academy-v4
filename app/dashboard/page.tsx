"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

type Profile = {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  country?: string;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [contractsSigned, setContractsSigned] = useState(0);
  const [totalContracts, setTotalContracts] = useState(0);
  const [guideReviewed, setGuideReviewed] = useState(false);
  const [guideReviewedAt, setGuideReviewedAt] = useState("");
  const [sopsCompleted, setSopsCompleted] = useState(0);
  const [totalSops, setTotalSops] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const guideId = "SA-DOCTOR-ONBOARDING-GUIDE";

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login to view your dashboard.");
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const userProfile = profileData || {
      id: user.id,
      email: user.email || "",
      role: "Doctor",
      country: "South Africa",
    };

    setProfile(userProfile);

    const role = userProfile?.role || "Doctor";
    const country = userProfile?.country || "South Africa";

    const { count: contractTotal } = await supabase
      .from("contracts")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    const { count: contractSignedCount } = await supabase
      .from("contract_signatures")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("accepted", true);

    const { data: guideReview } = await supabase
      .from("sop_reviews")
      .select("*")
      .eq("user_id", user.id)
      .eq("sop_id", guideId)
      .maybeSingle();

    const { count: sopTotalCount } = await supabase
      .from("sops")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .or(`country.eq.${country},country.eq.Global`);

    const { count: sopReviewedCount } = await supabase
      .from("sop_reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("reviewed", true)
      .neq("sop_id", guideId);

    const contractsDone = contractSignedCount || 0;
    const contractsTotal = contractTotal || 0;
    const sopsDone = sopReviewedCount || 0;
    const sopsTotal = sopTotalCount || 0;
    const guideDone = !!guideReview;

    setTotalContracts(contractsTotal);
    setContractsSigned(contractsDone);
    setGuideReviewed(guideDone);
    setGuideReviewedAt(
      guideReview?.reviewed_at
        ? new Date(guideReview.reviewed_at).toLocaleString()
        : ""
    );
    setTotalSops(sopsTotal);
    setSopsCompleted(sopsDone);

    const totalSteps = contractsTotal + sopsTotal + 1;
    const completedSteps = contractsDone + sopsDone + (guideDone ? 1 : 0);

    setOverallProgress(
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    );

    setLoading(false);
  }

  return (
    <>
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-careblue p-8 text-white">
          <h1 className="text-3xl font-bold">CareLink Academy Dashboard</h1>
          <p className="mt-2 text-carelight">
            Track your onboarding progress, contracts, guide review and SOP
            completion.
          </p>
        </div>

        {loading && (
          <p className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
            Loading dashboard...
          </p>
        )}

        {!loading && message && (
          <p className="mt-6 rounded-2xl bg-yellow-50 p-5 text-yellow-800">
            {message}
          </p>
        )}

        {!loading && (
          <>
            <section className="mt-8 grid gap-5 md:grid-cols-4">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Profile</p>
                <h2 className="mt-2 text-xl font-bold">
                  {profile?.full_name || "Not completed"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {profile?.role || "Doctor"} ·{" "}
                  {profile?.country || "South Africa"}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Contracts</p>
                <h2 className="mt-2 text-2xl font-bold">
                  {contractsSigned}/{totalContracts}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Signed contracts
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Guide</p>
                <h2 className="mt-2 text-2xl font-bold">
                  {guideReviewed ? "Done" : "Pending"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Doctor onboarding guide
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Overall Progress</p>
                <h2 className="mt-2 text-2xl font-bold">{overallProgress}%</h2>
                <div className="mt-3 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-careblue"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-careblue">
                My Selected Platforms
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Current onboarding pathway: VideoMed South African Doctor.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <Link
                  href="/learning"
                  className="rounded-2xl border p-5 text-center hover:bg-carelight"
                >
                  <p className="font-bold">Learning</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Complete platform modules
                  </p>
                </Link>

                <Link
                  href="/contracts"
                  className="rounded-2xl border p-5 text-center hover:bg-carelight"
                >
                  <p className="font-bold">Contracts</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {contractsSigned}/{totalContracts} signed
                  </p>
                </Link>

                <Link
                  href="/guide"
                  className="rounded-2xl border p-5 text-center hover:bg-carelight"
                >
                  <p className="font-bold">Doctor Guide</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {guideReviewed ? "Reviewed" : "Pending review"}
                  </p>
                </Link>

                <Link
                  href="/report"
                  className="rounded-2xl border p-5 text-center hover:bg-carelight"
                >
                  <p className="font-bold">Report</p>
                  <p className="mt-1 text-sm text-slate-600">
                    View onboarding status
                  </p>
                </Link>
              </div>
            </section>

            <section className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="font-bold text-careblue">Contract Sign-off</h3>
                <p className="mt-2 text-sm">
                  {contractsSigned > 0
                    ? `${contractsSigned} contract signed.`
                    : "No contract signed yet."}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="font-bold text-careblue">Onboarding Guide</h3>
                <p className="mt-2 text-sm">
                  {guideReviewed
                    ? `Reviewed on ${guideReviewedAt}`
                    : "Guide not reviewed yet."}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="font-bold text-careblue">SOP Reviews</h3>
                <p className="mt-2 text-sm">
                  {sopsCompleted}/{totalSops} SOPs reviewed.
                </p>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
