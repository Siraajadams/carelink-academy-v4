"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function CoursePage() {
  const params = useParams();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <Link href="/academy" className="text-blue-700">
        ← Back to Academy
      </Link>

      <h1 className="text-3xl font-bold mt-6">
        Course: {params.courseId}
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="font-semibold">
          Welcome to this course
        </h2>

        <p className="mt-2">
          Add lessons, videos, PDFs and assessments here.
        </p>
      </div>
    </main>
  );
}
