"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function register() {
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Check your email to confirm your account, then complete your profile."
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <Link href="/" className="mb-5 inline-block text-sm text-blue-700">
          ← Back to CareLink Academy
        </Link>

        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          Healthcare Worker Registration
        </h1>

        <p className="mb-6 text-sm text-slate-600">
          Create your account to access CareLink Academy onboarding, contracts,
          guides, SOPs and reports.
        </p>

        <input
          className="w-full border p-3 rounded-xl mb-3"
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex gap-2 mb-3">
          <input
            className="w-full border p-3 rounded-xl"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="border px-4 rounded-xl"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="button"
          onClick={register}
          className="w-full bg-blue-700 text-white p-3 rounded-xl font-semibold"
        >
          Create Account
        </button>

        {message && <p className="text-sm mt-4 text-red-600">{message}</p>}

        <p className="text-sm mt-5">
          Already registered?{" "}
          <Link href="/login" className="text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
