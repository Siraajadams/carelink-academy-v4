"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

type PlatformCourse = {
  name: string;
  slug: string;
  introVideo: string;
  introNarrative: string;
  howToVideo: string;
  howToNarrative: string;
  registerUrl: string;
};

const COURSE_CONTENT: Record<string, PlatformCourse> = {
  Videomed: {
    name: "Videomed",
    slug: "videomed",
    introVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    introNarrative:
      "Videomed connects healthcare practitioners with patients through virtual consultations, digital workflows and pharmacy-supported care pathways.",
    howToVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    howToNarrative:
      "This guide explains how practitioners access the platform, manage consultations, complete patient documentation and support referral pathways.",
    registerUrl: "https://videomed.co.za",
  },

  CPNBS: {
    name: "CPNBS",
    slug: "cpnbs",
    introVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    introNarrative:
      "CPNBS supports community pharmacy appointment requests and helps connect patients to pharmacy-led healthcare services.",
    howToVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    howToNarrative:
      "This guide explains how to receive appointment requests, review patient details, contact the patient and manage booking follow-up.",
    registerUrl: "https://cpnbs.com",
  },

  "Symptom.AI": {
    name: "Symptom.AI",
    slug: "symptom-ai",
    introVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    introNarrative:
      "Symptom.AI supports patient triage by helping healthcare workers review symptoms, risk levels and recommended care pathways.",
    howToVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    howToNarrative:
      "This guide explains how to complete a symptom assessment, interpret triage outputs and direct patients to the correct care option.",
    registerUrl: "https://symptomai.digital",
  },

  Carelink: {
    name: "Carelink",
    slug: "carelink",
    introVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    introNarrative:
      "Carelink supports healthcare referral, onboarding and care coordination workflows across pharmacies, doctors and healthcare partners.",
    howToVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    howToNarrative:
      "This guide explains how to use Carelink to manage referrals, access practitioner workflows and support patient navigation.",
    registerUrl: "https://carelink.digital",
  },

  "Clinical Voice Transcriber": {
    name: "Clinical Voice Transcriber",
    slug: "clinical-voice-transcriber",
    introVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    introNarrative:
      "The Clinical Voice Transcriber helps healthcare practitioners convert consultation voice notes into structured clinical documentation.",
    howToVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    howToNarrative:
      "This guide explains how to record, review and use transcribed clinical notes safely within the consultation workflow.",
    registerUrl: "#",
  },

  "Weight Management": {
    name: "Weight Management",
    slug: "weight-management",
    introVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    introNarrative:
      "The Weight Management programme supports structured patient onboarding, clinical review and follow-up for weight-loss care pathways.",
    howToVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    howToNarrative:
      "This guide explains how to review eligibility, support treatment follow-up and document patient progress.",
    registerUrl: "#",
  },

  "HIV Prevention Services": {
    name: "HIV Prevention Services",
    slug: "hiv-prevention-services",
    introVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    introNarrative:
      "HIV Prevention Services training introduces pharmacy-led and practitioner-supported HIV prevention workflows including PrEP awareness and referral.",
    howToVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    howToNarrative:
      "This guide explains patient education, referral, documentation and follow-up responsibilities in HIV prevention services.",
    registerUrl: "#",
  },

  "Independent Prescribing": {
    name: "Independent Prescribing",
    slug: "independent-prescribing",
    introVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    introNarrative:
      "Independent Prescribing training supports practitioners with safe, structured prescribing workflows and governance expectations.",
    howToVideo: "https://www.youtube.com/embed/REPLACE_VIDEO_ID",
    howToNarrative:
      "This guide explains prescribing documentation, clinical checks, escalation and record-keeping expectations.",
    registerUrl: "#",
  },
};

function parsePlatformAccess(value: string | string[] | null) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function LearningPage() {
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearning();
  }, []);

  async function loadLearning() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("healthcare_workers")
      .select("platform_access_needed")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const selected = parsePlatformAccess(data?.platform_access_needed || "");
    setPlatforms(selected);
    setLoading(false);
  }

  async function markReviewed(platform: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in first.");
      return;
    }

    const { error } = await supabase.from("course_progress").insert({
      user_id: user.id,
      platform,
      reviewed: true,
      reviewed_at: new Date().toISOString(),
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`${platform} learning reviewed successfully.`);
  }

  if (loading) {
    return (
      <>
        <TopNav />
        <main className="min-h-screen bg-slate-50 p-8">
          <p>Loading learning content...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNav />

      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-careblue p-8 text-white">
            <h1 className="text-3xl font-bold">Learning</h1>
            <p className="mt-2 text-carelight">
              Review the selected platform courses, watch the training videos and proceed to registration.
            </p>
          </div>

          {message && (
            <p className="mt-4 rounded-xl bg-white p-4 text-sm text-blue-700 shadow">
              {message}
            </p>
          )}

          {platforms.length === 0 ? (
            <div className="mt-8 rounded-3xl bg-white p-8 shadow">
              <p>No platform access has been selected yet.</p>
              <Link href="/profile" className="mt-4 inline-block text-blue-700">
                Return to profile
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {platforms.map((platform) => {
                const course = COURSE_CONTENT[platform];

                if (!course) return null;

                return (
                  <section
                    key={course.slug}
                    className="rounded-3xl bg-white p-8 shadow"
                  >
                    <h2 className="text-2xl font-bold text-blue-700">
                      Course Selected: {course.name}
                    </h2>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-xl font-semibold">
                          1. Introduction to {course.name}
                        </h3>

                        <div className="mt-4 aspect-video overflow-hidden rounded-2xl bg-slate-100">
                          <iframe
                            className="h-full w-full"
                            src={course.introVideo}
                            title={`${course.name} introduction video`}
                            allowFullScreen
                          />
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-600">
                          {course.introNarrative}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold">
                          2. How to use {course.name}
                        </h3>

                        <div className="mt-4 aspect-video overflow-hidden rounded-2xl bg-slate-100">
                          <iframe
                            className="h-full w-full"
                            src={course.howToVideo}
                            title={`${course.name} how to use video`}
                            allowFullScreen
                          />
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-600">
                          {course.howToNarrative}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={course.registerUrl}
                        target="_blank"
                        className="rounded-xl bg-careblue px-5 py-3 font-semibold text-white"
                      >
                        3. Proceed to Register
                      </a>

                      <button
                        type="button"
                        onClick={() => markReviewed(course.name)}
                        className="rounded-xl border px-5 py-3 font-semibold text-careblue"
                      >
                        Mark Learning Reviewed
                      </button>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
