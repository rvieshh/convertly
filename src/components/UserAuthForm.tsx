"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

export function UserAuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const s = useSettings();
  const isRegister = mode === "register";

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister ? { email, username, password, confirm } : { email, password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const input = "w-full rounded-[8px] border border-line bg-bg px-3 py-2.5 text-sm text-white outline-none focus:border-primary";

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-[14px] border border-line bg-surface p-6 sm:p-7 elev-raised">
        <h1 className="text-xl font-bold text-white">
          {isRegister ? `Create your ${s.siteName} account` : `Sign in to ${s.siteName}`}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {isRegister ? "Register to unlock higher limits and saved history." : "Welcome back."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={input} />
          </div>
          {isRegister && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className={input} />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isRegister ? "new-password" : "current-password"} className={input} />
          </div>
          {isRegister && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Confirm password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" className={input} />
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {isRegister ? (
            <>Already have an account? <a href="/login" className="font-medium text-primary hover:underline">Sign in</a></>
          ) : (
            <>New here? <a href="/register" className="font-medium text-primary hover:underline">Create an account</a></>
          )}
        </p>
      </div>
    </div>
  );
}
