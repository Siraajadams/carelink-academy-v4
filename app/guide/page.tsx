import TopNav from "@/components/TopNav";

export default function GuidePage() {
  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-careblue">VideoMed Doctor Operations Guide</h1>
          <p className="mt-2 text-slate-600">
            Review the onboarding guide before completing platform training. The guide covers platform registration,
            CareLink bookings, attendance and leave, services offered, billing, medical aid process, pathology, stock,
            room safety, community outreach and key contacts.
          </p>
          <a href="/documents/videomed_doctor_guide.pdf" target="_blank" className="mt-5 inline-block rounded-xl bg-careblue px-5 py-3 font-semibold text-white">
            Open guide
          </a>
          <div className="mt-6 overflow-hidden rounded-2xl border">
            <iframe src="/documents/videomed_doctor_guide.pdf" className="h-[760px] w-full" />
          </div>
        </div>
      </main>
    </>
  );
}
