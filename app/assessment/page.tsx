"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const questions = [
  {
    q: "What should a healthcare worker do before using a digital health platform with patients?",
    options: ["Start immediately", "Complete onboarding and understand SOPs", "Share login details", "Skip consent"],
    answer: "Complete onboarding and understand SOPs"
  },
  {
    q: "Which documents are important for safe digital health workflows?",
    options: ["SOPs and escalation pathways", "Social media posts only", "Invoices only", "None"],
    answer: "SOPs and escalation pathways"
  },
  {
    q: "Why is country-specific training important?",
    options: ["Different privacy, clinical and operational rules may apply", "It is not important", "Only branding changes", "It replaces all clinical judgement"],
    answer: "Different privacy, clinical and operational rules may apply"
  }
];

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);

  async function submit() {
    let total = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) total++;
    });
    const result = Math.round((total / questions.length) * 100);
    setScore(result);

    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.from("assessments").insert({
        user_id: data.user.id,
        assessment_name: "CareLink Academy Core Onboarding",
        score: result,
        passed: result >= 80
      });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-careblue">Quick Assessment</h1>
        <div className="mt-6 space-y-6">
          {questions.map((q, i) => (
            <div key={q.q}>
              <h2 className="font-semibold">{i + 1}. {q.q}</h2>
              <div className="mt-3 grid gap-2">
                {q.options.map(o => (
                  <button key={o} onClick={() => setAnswers({...answers, [i]: o})}
                    className={`rounded-xl border p-3 text-left ${answers[i] === o ? "border-careblue bg-carelight" : ""}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={submit} className="mt-6 rounded-xl bg-careblue px-6 py-3 font-semibold text-white">Submit assessment</button>
        {score !== null && (
          <div className="mt-6 rounded-2xl bg-carelight p-5">
            <p className="font-bold">Score: {score}%</p>
            <p>{score >= 80 ? "Passed. You are ready for the next onboarding step." : "Please review the modules and retake the assessment."}</p>
            <Link href="/report" className="mt-3 inline-block font-semibold text-careblue">View knowledge report</Link>
          </div>
        )}
      </div>
    </main>
  );
}
