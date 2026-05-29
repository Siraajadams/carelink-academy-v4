"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import TopNav from "@/components/TopNav";

type Module = {
  id: string;
  title: string;
  description: string;
  country: string;
  role: string;
  content_url: string;
  content_type: string;
};

export default function DashboardPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setUserId(userData.user.id);

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single();
      const { data: moduleData } = await supabase
        .from("modules")
        .select("*")
        .or(`country.eq.Global,country.eq.${profile?.country}`)
        .or(`role.eq.All,role.eq.${profile?.role}`)
        .order("sort_order");

      const { data: progressData } = await supabase.from("progress").select("*").eq("user_id", userData.user.id);
      const progressMap: Record<string, boolean> = {};
      progressData?.forEach((p: any) => progressMap[p.module_id] = p.completed);

      setModules(moduleData || []);
      setCompleted(progressMap);
    }
    load();
  }, []);

  async function markComplete(moduleId: string) {
    const next = !completed[moduleId];
    setCompleted({ ...completed, [moduleId]: next });
    await supabase.from("progress").upsert({
      user_id: userId,
      module_id: moduleId,
      completed: next,
      completed_at: next ? new Date().toISOString() : null
    });
  }

  const completeCount = Object.values(completed).filter(Boolean).length;
  const percent = modules.length ? Math.round((completeCount / modules.length) * 100) : 0;

  return (
    <>
    <TopNav />
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-3xl bg-careblue p-8 text-white">
        <h1 className="text-3xl font-bold">My Learning Path</h1>
        <p className="mt-2 text-carelight">Complete your assigned modules, SOPs, videos and assessments.</p>
        <div className="mt-6 h-4 rounded-full bg-white/20">
          <div className="h-4 rounded-full bg-white" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-sm">{percent}% complete</p>
      </div>

      <div className="mt-8 grid gap-5">
        {modules.map(m => (
          <div key={m.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase text-careblue">{m.content_type}</p>
                <h2 className="text-xl font-bold">{m.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{m.description}</p>
                <a className="mt-3 inline-block text-sm font-semibold text-careblue" href={m.content_url} target="_blank">
                  Open training content
                </a>
              </div>
              <button onClick={() => markComplete(m.id)} className={`rounded-xl px-5 py-3 font-semibold ${completed[m.id] ? "bg-green-100 text-green-700" : "bg-carelight text-careblue"}`}>
                {completed[m.id] ? "Completed" : "Mark complete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/assessment" className="rounded-xl bg-careblue px-5 py-3 font-semibold text-white">Take assessment</Link>
        <Link href="/contracts" className="rounded-xl border px-5 py-3 font-semibold text-careblue">Review/sign contract</Link>
        <Link href="/report" className="rounded-xl border px-5 py-3 font-semibold text-careblue">View knowledge report</Link>
      </div>
    </main>
    </>
  );
}
