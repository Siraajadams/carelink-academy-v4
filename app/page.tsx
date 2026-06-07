"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-careblue">
            CareLink Academy
          </h1>

          <div className="flex gap-4 text-sm font-semibold">
            <Link href="/login">Login</Link>
            <Link
              href="/register"
              className="rounded-xl bg-careblue px-4 py-2 text-white"
            >
              Create Account
            </Link>
          </div>
        </nav>

        <section className="mt-12 grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 font-semibold text-careblue">
              Built by Doctors and Pharmacists
            </p>

            <h2 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Simplifying digital health onboarding and adoption
            </h2>

            <p className="mt-5 text-lg text-slate-600">
              CareLink Academy helps healthcare professionals complete training,
              contracts, SOP reviews, onboarding guides, assessments and
              compliance records for digital health platforms.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-xl bg-careblue px-6 py-3 font-semibold text-white"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="rounded-xl border px-6 py-3 font-semibold"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80"
              alt="Healthcare professionals using digital health technology"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </section>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-careblue">About Us</h2>

          <p className="mt-5 max-w-4xl text-lg text-slate-600">
            CareLink Academy was built by doctors, pharmacists and digital
            health specialists to simplify healthtech onboarding, training and
            adoption. We understand that healthcare professionals need clear,
            practical and compliant digital learning pathways.
          </p>

          <p className="mt-4 max-w-4xl text-lg text-slate-600">
            Our platform supports healthcare teams with structured onboarding,
            contract sign-off, SOP review, digital guide confirmation,
            certification tracking and audit-ready reporting.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-careblue">
            Supporting HealthTech Adoption Globally
          </h2>

          <p className="mt-4 max-w-4xl text-lg text-slate-600">
            We work with healthcare and digital health partners across South
            Africa, the United Kingdom and New Zealand.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">🇿🇦 South Africa</h3>
              <p className="mt-3 text-slate-600">
                Supporting doctors, pharmacies and digital care programmes.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">🇬🇧 United Kingdom</h3>
              <p className="mt-3 text-slate-600">
                Enabling community pharmacy and digital health onboarding.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">🇳🇿 New Zealand</h3>
              <p className="mt-3 text-slate-600">
                Supporting scalable healthcare innovation and adoption.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-careblue">What We Offer</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              "Digital Health Platform Onboarding",
              "SOP & Compliance Training",
              "Electronic Contract Sign-off",
              "Doctor Guide Confirmation",
              "Assessment & Certification Tracking",
              "Audit-Ready Knowledge Reports",
            ].map((item) => (
              <div key={item} className="rounded-3xl border bg-slate-50 p-6">
                <h3 className="text-lg font-bold">{item}</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Structured workflows that help healthcare professionals safely
                  adopt digital health platforms.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-careblue py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold">
            Built for real-world healthcare adoption
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-carelight">
            CareLink Academy brings training, compliance, onboarding and
            reporting together in one simple digital health learning platform.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-bold text-careblue"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 px-6 py-8 text-center text-sm text-slate-300">
        © 2026 CareLink Academy. Built by healthcare professionals for
        healthcare professionals.
      </footer>
    </main>
  );
}
