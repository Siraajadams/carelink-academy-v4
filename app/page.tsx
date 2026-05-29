import Link from "next/link";
import { GraduationCap, ClipboardCheck, FileVideo, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="bg-careblue text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-carelight">CareLink Academy</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Training healthcare teams for digital care.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-carelight">
            A practical onboarding platform for doctors, pharmacists, nurses and counsellors using digital health platforms across South Africa, England, Wales, Scotland and New Zealand.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/signup" className="rounded-2xl bg-white px-6 py-3 font-semibold text-careblue shadow">
              Create Profile
            </Link>
            <Link href="/login" className="rounded-2xl border border-white/40 px-6 py-3 font-semibold text-white">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-12 md:grid-cols-4">
        {[
          ["Role-based learning", GraduationCap],
          ["SOPs and videos", FileVideo],
          ["Progress tracking", ClipboardCheck],
          ["Knowledge reports", BarChart3],
        ].map(([title, Icon]: any) => (
          <div key={title} className="rounded-3xl bg-white p-6 shadow-sm">
            <Icon className="mb-4 h-8 w-8 text-careblue" />
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">Built for low-cost onboarding and operational readiness.</p>
          </div>
        ))}
      </section>
    </main>
  );
}
