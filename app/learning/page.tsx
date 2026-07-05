"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import TopNav from "@/components/TopNav";

type CourseVideo = {
  title: string;
  description: string;
  youtubeUrl: string;
};

type PlatformCourse = {
  name: string;
  slug: string;
  introVideo: string;
  introNarrative: string;
  howToVideo: string;
  howToNarrative: string;
  registerUrl: string;
};

const CPNBS_VIDEOS: CourseVideo[] = [
  {
    title: "Benefits of Carelink Booking Platform",
    youtubeUrl: "https://youtu.be/p-RVogkVT9w",
    description:
      "Overview of the benefits of the Carelink Booking Platform and how it improves patient access and appointment management.",
  },
  {
    title: "Weight Loss with Wegovy",
    youtubeUrl: "https://youtu.be/5659-7LxLyE",
    description:
      "Introduction to the Weight Loss with Wegovy programme and associated clinical workflows.",
  },
  {
    title: "Make a Booking on Carelink",
    youtubeUrl: "https://youtu.be/4rAjBIb7A-U",
    description:
      "Step-by-step guide showing how to create and manage bookings within Carelink.",
  },
  {
    title: "Update Your Appointment Management for Videomed",
    youtubeUrl: "https://youtu.be/yLzM6vN-QmY",
    description:
      "Learn how to manage, update and maintain appointments within the Videomed platform.",
  },
  {
    title: "Pharmacy First Appointment with CPNBS",
    youtubeUrl: "https://youtu.be/tzoBQMqHimA",
    description:
      "Complete Pharmacy First appointment workflow using the CPNBS platform.",
  },
];

const COURSE_CONTENT: Record<string, PlatformCourse> = {
  Videomed: {
    name: "Videomed",
    slug: "videomed",
    introVideo: "https://youtu.be/KN4dmd-rlFE",
    introNarrative:
      "Welcome to VideoMed. This introduction explains the purpose of the platform, virtual consultations, digital healthcare workflows and pharmacy-supported care.",
    howToVideo: "https://youtu.be/U8ss1FUlaRc",
    howToNarrative:
      "This training demonstrates how to register, access the platform, complete onboarding and begin using VideoMed in clinical practice.",
    registerUrl: "https://videomed.co.za",
  },

  CPNBS: {
    name: "CPNBS",
    slug: "cpnbs",
    introVideo: "",
    introNarrative:
      "CPNBS supports community pharmacy appointment requests and helps connect patients to pharmacy-led healthcare services.",
    howToVideo: "",
    howToNarrative:
      "This guide explains how to receive appointment requests, review patient details, contact the patient and manage booking follow-up.",
    registerUrl: "https://cpnbs.com",
  },

  "Symptom.AI": {
    name: "Symptom.AI",
    slug: "symptom-ai",
    introVideo: "",
    introNarrative:
      "Symptom.AI supports patient triage by helping healthcare workers review symptoms, risk levels and recommended care pathways.",
    howToVideo: "",
    howToNarrative:
      "This guide explains how to complete a symptom assessment, interpret triage outputs and direct patients to the correct care option.",
    registerUrl: "https://symptomai.digital",
  },

  Carelink: {
    name: "Carelink",
    slug: "carelink",
    introVideo: "",
    introNarrative:
      "Carelink supports healthcare referral, onboarding and care coordination workflows across pharmacies, doctors and healthcare partners.",
    howToVideo: "",
    howToNarrative:
      "This guide explains how to use Carelink to manage referrals, access practitioner workflows and support patient navigation.",
    registerUrl: "https://carelink.digital",
  },

  "Clinical Voice Transcriber": {
    name: "Clinical Voice Transcriber",
    slug: "clinical-voice-transcriber",
    introVideo: "",
    introNarrative:
      "The Clinical Voice Transcriber helps healthcare practitioners convert consultation voice notes into structured clinical documentation.",
    howToVideo: "",
    howToNarrative:
      "This guide explains how to record, review and use transcribed clinical notes safely within the consultation workflow.",
    registerUrl: "#",
  },

  "Weight Management": {
    name: "Weight Management",
    slug: "weight-management",
    introVideo: "",
    introNarrative:
      "The Weight Management programme supports structured patient onboarding, clinical review and follow-up for weight-loss care pathways.",
    howToVideo: "",
    howToNarrative:
      "This guide explains how to review eligibility, support treatment follow-up and document patient progress.",
    registerUrl: "#",
  },

  "HIV Prevention Services": {
    name: "HIV Prevention Services",
    slug: "hiv-prevention-services",
    introVideo: "",
    introNarrative:
      "HIV Prevention Services training introduces pharmacy-led and practitioner-supported HIV prevention workflows including PrEP awareness and referral.",
    howToVideo: "",
    howToNarrative:
      "This guide explains patient education, referral, documentation and follow-up responsibilities in HIV prevention services.",
    registerUrl: "#",
  },

  "Independent Prescribing": {
    name: "Independent Prescribing",
    slug: "independent-prescribing",
    introVideo: "",
    introNarrative:
      "Independent Prescribing training supports practitioners with safe, structured prescribing workflows and governance expectations.",
    howToVideo: "",
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

function getYouTubeId(url: string) {
  if (!url) return "";

  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  }

  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1].split("&")[0];
  }

  if (url.includes("/embed/")) {
    return url.split("/embed/")[1].split("?")[0];
  }

  return "";
}

function VideoCard({
  title,
  description,
  youtubeUrl,
  lessonNumber,
}: {
  title: string;
  description: string;
  youtubeUrl: string;
  lessonNumber: number;
}) {
  const videoId = getYouTubeId(youtubeUrl);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "";

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">
        {lessonNumber}. {title}
      </h3>

      {youtubeUrl ? (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-4 block aspect-video overflow-hidden rounded-xl bg-slate-100"
        >
          {thumbnail && (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow">
              ▶
            </div>
          </div>
        </a>
      ) : (
        <div className="mt-4 flex aspect-video items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          Video coming soon
        </div>
      )}

      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

      {youtubeUrl && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          ▶ Watch Video
        </a>
      )}
    </div>
  );
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

    setPlatforms(parsePlatformAccess(data?.platform_access_needed || ""));
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
              Review your training modules, open videos in YouTube, then mark
              each platform as reviewed.
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

                    {course.name === "CPNBS" ? (
                      <div className="mt-8 grid gap-8 md:grid-cols-2">
                        {CPNBS_VIDEOS.map((video, index) => (
                          <VideoCard
                            key={video.youtubeUrl}
                            title={video.title}
                            description={video.description}
                            youtubeUrl={video.youtubeUrl}
                            lessonNumber={index + 1}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <VideoCard
                          title={`Introduction to ${course.name}`}
                          description={course.introNarrative}
                          youtubeUrl={course.introVideo}
                          lessonNumber={1}
                        />

                        <VideoCard
                          title={`How to Register for ${course.name}`}
                          description={course.howToNarrative}
                          youtubeUrl={course.howToVideo}
                          lessonNumber={2}
                        />
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={course.registerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-careblue px-5 py-3 font-semibold text-white"
                      >
                        Proceed to {course.name}
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
