"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function signup() {
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://carelink-academy-v4.vercel.app/profile",
      },
    });

    if (error) setMessage(error.message);
    else setMessage("Check your email to confirm your account, then complete your profile.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-blue-700">Create your CareLink Academy account</h1>

        <input className="mt-6 w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="mt-3 flex rounded-xl border">
          <input className="w-full rounded-xl p-3" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="px-3" onClick={() => setShowPassword(!showPassword)} type="button">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button onClick={signup} className="mt-6 w-full rounded-xl bg-blue-700 p-3 font-semibold text-white">
          Create Account
        </button>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <p className="mt-5 text-sm">
          Already registered? <Link href="/login" className="text-blue-700">Login</Link>
        </p>
      </div>
    </main>
  );
}
