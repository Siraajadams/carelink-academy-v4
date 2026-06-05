"use client";

import Link from "next/link";

const COURSES = [
  "Videomed",
  "CPNBS",
  "Symptom.AI",
  "Clinical Voice Transcriber",
  "Weight Management",
  "HIV Prevention Services",
  "Independent Prescribing",
  "Carelink",
];

function slugify(name: string) {
  return name.toLowerCase().replaceAll(".", "").replaceAll(" ", "-");
}

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Training Academy
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COURSES.map((course) => (
          <Link
            key={course}
            href={`/academy/${slugify(course)}`}
            className="bg-white rounded-xl shadow p-6 hover:bg-blue-50"
          >
            <h2 className="font-semibold text-lg">{course}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
