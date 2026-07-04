"use client";

import Link from "next/link";

export default function DashboardPage() {
  const progressCards = [
    {
      label: "Profile",
      value: "Not completed",
      detail: "Doctor · South Africa",
    },
    {
      label: "Contracts",
      value: "1/1",
      detail: "Signed contracts",
    },
    {
      label: "Guide",
      value: "Done",
      detail: "Doctor onboarding guide",
    },
    {
      label: "SOPs",
      value: "3/6",
      detail: "SOP reviews",
    },
    {
      label: "Overall Progress",
      value: "63%",
      detail: "Onboarding completion",
    },
  ];

  const trainingModules = [
    {
      step: "Step 1",
      title: "Learning",
      text: "Complete platform modules",
      href: "/learning",
    },
    {
      step: "Step 2",
      title: "Contracts",
      text: "Sign required contracts",
      href: "/contracts",
    },
    {
      step: "Step 3",
      title: "Doctor Guide",
      text: "Review onboarding guide",
      href: "/guide",
    },
    {
      step: "Step 4",
      title: "SOPs",
      text: "Review SOP documents",
      href: "/sops",
    },
    {
      step: "Step 5",
      title: "Report",
      text: "View onboarding status",
      href: "/report",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl bg-blue-700 p-8 text-white shadow-sm">
          <h1 className="text-3xl font-bold">CareLink Academy Dashboard</h1>
          <p className="mt-2 text-blue-100">
            Complete your healthcare worker onboarding and training pathway.
          </p>
        </section>

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            My Training Modules
          </h2>
          <p className="mt-2 text-slate-600">
            Complete each step in order to finish your onboarding.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {trainingModules.map((item, index) => (
              <div key={item.title} className="flex items-center gap-3">
                <Link
                  href={item.href}
                  className="block min-w-[190px] rounded-2xl border bg-white p-5 shadow-sm transition hover:border-blue-500 hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-blue-700">
                    {item.step}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{item.text}</p>
                </Link>

                {index < trainingModules.length - 1 && (
                  <span className="text-3xl font-bold text-slate-400">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-5">
          {progressCards.map((card) => (
            <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {card.value}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{card.detail}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Contract Sign-off</h2>
            <p className="mt-2 text-slate-600">
              Review and sign your required onboarding contract.
            </p>
            <Link
              href="/contracts"
              className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
            >
              Open Contracts
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Onboarding Guide</h2>
            <p className="mt-2 text-slate-600">
              Read the onboarding guide and confirm review.
            </p>
            <Link
              href="/guide"
              className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
            >
              Open Guide
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">SOP Reviews</h2>
            <p className="mt-2 text-slate-600">
              Complete all SOP reviews for your role and country.
            </p>
            <Link
              href="/sops"
              className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
            >
              Open SOPs
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
