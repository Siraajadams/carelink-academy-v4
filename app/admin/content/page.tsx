"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminContentPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("CPNBS");
  const [message, setMessage] = useState("");

  async function createCourse() {
    const { error } = await supabase.from("courses").insert({
      title,
      description,
      platform,
      is_active: true,
    });

    if (error) setMessage(error.message);
    else {
      setMessage("Course created successfully");
      setTitle("");
      setDescription("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Admin Content Management
        </h1>

        <input className="border p-3 rounded-xl w-full mb-3" placeholder="Course title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <textarea className="border p-3 rounded-xl w-full mb-3" placeholder="Course description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <select className="border p-3 rounded-xl w-full mb-3" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option>CPNBS</option>
          <option>Pharmacy First</option>
          <option>Videomed Registration</option>
          <option>Videomed Prescribing</option>
          <option>CareLink Appointments</option>
        </select>

        <button onClick={createCourse} className="bg-blue-700 text-white px-6 py-3 rounded-xl">
          Create Course
        </button>

        {message && <p className="mt-4">{message}</p>}
      </div>
    </main>
  );
}
