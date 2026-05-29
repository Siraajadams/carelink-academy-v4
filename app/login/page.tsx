"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login() {
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else router.push("/profile");
  }

  async function resetPassword() {
    if (!email) {
      setMessage("Enter your email first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setMessage(error ? error.message : "Password reset email sent.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-careblue">Login</h1>
        <input className="mt-6 w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="mt-3 w-full rounded-xl border p-3" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login} className="mt-5 w-full rounded-xl bg-careblue p-3 font-semibold text-white">Login</button>
        <button onClick={resetPassword} className="mt-3 w-full rounded-xl border p-3 font-semibold text-careblue">Reset password</button>
        {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
        <p className="mt-5 text-sm">New user? <Link className="text-careblue" href="/signup">Create account</Link></p>
      </div>
    </main>
  );
}
