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
        .maybeSingle();

      setProfile(profileData);

      if (profileData?.platform_access) {
        setPlatforms(profileData.platform_access);
      }

      const { data: contracts } = await supabase
        .from("signed_contracts")
        .select("*")
        .eq("user_id", user.id);

      setContractsSigned(contracts?.length || 0);

      const { data: allSops } = await supabase
        .from("sops")
        .select("*")
        .eq("is_active", true);

      setTotalSops(allSops?.length || 0);

      const { data: reviewedSops } = await supabase
        .from("sop_reviews")
        .select("*")
        .eq("user_id", user.id);

      setSopsCompleted(reviewedSops?.length || 0);

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
    (contractsSigned > 0 ? 30 : 0) +
      (totalSops > 0 ? (sopsCompleted / totalSops) * 40 : 0) +
      ((assessmentScore || 0) / 100) * 30
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
            Welcome {profile?.first_name || profile?.full_name || "Healthcare Practitioner"}
          </h1>
          <p className="mt-2 opacity-90">
            CareLink Academy Practitioner Onboarding Portal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <DashboardCard title="Platforms Selected" value={platforms.length} />
          <DashboardCard title="Contracts Signed" value={contractsSigned} />
          <DashboardCard title="SOP Progress" value={`${sopsCompleted}/${totalSops}`} />
          <DashboardCard title="Assessment Score" value={`${assessmentScore}%`} />
          <DashboardCard title="Compliance" value={`${complianceScore}%`} />
        </div>

        <div className="mt-10 rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">My Selected Platforms</h2>

          {platforms.length === 0 ? (
            <p>No platform access selected.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {platforms.map((platform) => (
                <div key={platform} className="rounded-2xl border p-5">
                  <h3 className="text-xl font-semibold">{platform}</h3>
                  <p className="mt-2 text-gray-600">
                    Introduction, training videos, onboarding steps and registration.
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

        <div className="mt-10 grid gap-4 md:grid-cols-5">
          <NavCard href="/learning" title="Learning" text="Platform training modules" />
          <NavCard href="/contracts" title="Contracts" text="Review & sign agreements" />
          <NavCard href="/guide" title="Doctor Guide" text="Doctor onboarding guide" />
          <NavCard href="/sops" title="SOPs" text="Review required SOPs" />
          <NavCard href="/report" title="Report" text="Progress & compliance" />
        </div>
      </main>
    </>
  );
}

function DashboardCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function NavCard({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link href={href} className="rounded-2xl border p-6 text-center hover:bg-gray-50">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm">{text}</p>
    </Link>
  );
}
