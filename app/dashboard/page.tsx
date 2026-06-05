"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [contractsSigned, setContractsSigned] = useState(0);
  const [sopsCompleted, setSopsCompleted] = useState(0);
  const [totalSops, setTotalSops] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      if (profileData?.platform_access) {
        setPlatforms(profileData.platform_access);
      }

      const { data: contracts } = await supabase
        .from("signed_contracts")
        .select("*")
        .eq("user_id", user.id);

      setContractsSigned(contracts?.length || 0);

      const { data: sops } = await supabase
        .from("sop_progress")
        .select("*")
        .eq("user_id", user.id);

      const completed = sops?.filter(
        (s: any) => s.completed === true
      ).length || 0;

      setSopsCompleted(completed);
      setTotalSops(sops?.length || 0);

      const { data: assessments } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (assessments?.length) {
        setAssessmentScore(assessments[0].score || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const complianceScore = Math.round(
    (
      (contractsSigned > 0 ? 30 : 0) +
      (totalSops > 0 ? (sopsCompleted / totalSops) * 40 : 0) +
      ((assessmentScore || 0) / 100) * 30
    )
  );

  if (loading) {
    return (
      <>
        <TopNav />
        <div className="p-10">Loading dashboard...</div>
      </>
    );
  }

  return (
    <>
      <TopNav />

      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8 rounded-3xl bg-careblue p-8 text-white">
          <h1 className="text-3xl font-bold">
            Welcome {profile?.first_name || "Healthcare Practitioner"}
          </h1>

          <p className="mt-2 opacity-90">
            CareLink Academy Practitioner Onboarding Portal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-5">

          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              Platforms Selected
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {platforms.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              Contracts Signed
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {contractsSigned}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              SOP Progress
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {sopsCompleted}/{totalSops}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              Assessment Score
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {assessmentScore}%
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h3 className="text-sm text-gray-500">
              Compliance
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {complianceScore}%
            </p>
          </div>

        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">
            My Selected Platforms
          </h2>

          {platforms.length === 0 ? (
            <p>No platform access selected.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">

              {platforms.map((platform) => (
                <div
                  key={platform}
                  className="rounded-2xl border p-5"
                >
                  <h3 className="text-xl font-semibold">
                    {platform}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Introduction, training videos,
                    onboarding steps and registration.
                  </p>

                  <Link
                    href={`/academy/${encodeURIComponent(platform)}`}
                    className="mt-4 inline-block rounded-xl bg-careblue px-4 py-2 text-white"
                  >
                    Open Course
                  </Link>
                </div>
              ))}

            </div>
          )}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">

          <Link
            href="/learning"
            className="rounded-2xl border p-6 text-center hover:bg-gray-50"
          >
            <h3 className="font-bold">Learning</h3>
            <p className="mt-2 text-sm">
              Platform training modules
            </p>
          </Link>

          <Link
            href="/contracts"
            className="rounded-2xl border p-6 text-center hover:bg-gray-50"
          >
            <h3 className="font-bold">Contracts</h3>
            <p className="mt-2 text-sm">
              Review & sign agreements
            </p>
          </Link>

          <Link
            href="/guide"
            className="rounded-2xl border p-6 text-center hover:bg-gray-50"
          >
            <h3 className="font-bold">Doctor Guide</h3>
            <p className="mt-2 text-sm">
              SOPs & Indemnity Upload
            </p>
          </Link>

          <Link
            href="/report"
            className="rounded-2xl border p-6 text-center hover:bg-gray-50"
          >
            <h3 className="font-bold">Report</h3>
            <p className="mt-2 text-sm">
              Progress & Compliance
            </p>
          </Link>

        </div>

      </main>
    </>
  );
}
