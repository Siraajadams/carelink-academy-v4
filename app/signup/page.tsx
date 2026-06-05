"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signup() {
    setMessage("");
    const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    https://carelink-academy-v4-n3jwp4ffn-siraajadams2003-1686s-projects.vercel.app/
  }
});
    if (error) setMessage(error.message);
    else setMessage("Check your email to confirm your account, then log in.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-careblue">Create your CareLink Academy profile</h1>
        <input className="mt-6 w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="mt-3 w-full rounded-xl border p-3" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={signup} className="mt-5 w-full rounded-xl bg-careblue p-3 font-semibold text-white">Sign up</button>
        {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
        <p className="mt-5 text-sm">Already registered? <Link className="text-careblue" href="/login">Login</Link></p>
      </div>
    </main>
  );
}
