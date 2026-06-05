"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function login() {
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/profile";
    }
  }

  async function resetPassword() {
    setMessage("");

    if (!email) {
      setMessage("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset email sent.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          className="mt-6 w-full rounded-xl border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mt-3 flex rounded-xl border">
          <input
            className="w-full rounded-xl p-3 outline-none"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-4"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={login}
          className="mt-5 w-full rounded-xl bg-blue-700 p-3 font-semibold text-white"
        >
          Login
        </button>

        <button
          onClick={resetPassword}
          className="mt-3 w-full rounded-xl border p-3"
        >
          Reset password
        </button>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <p className="mt-5 text-sm">
          New user?{" "}
          <Link className="text-blue-700" href="/signup">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
