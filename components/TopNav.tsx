import Link from "next/link";

export default function TopNav() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-lg font-bold text-careblue">CareLink Academy</Link>
        <nav className="flex gap-4 text-sm font-semibold text-slate-700">
          <Link href="/dashboard">Learning</Link>
          <Link href="/contracts">Contracts</Link>
          <Link href="/guide">Doctor Guide</Link>
          <Link href="/report">Report</Link>
        </nav>
      </div>
    </header>
  );
}
