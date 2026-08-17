"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Repeat, Loader2, Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      // First login with default creds -> forced setup, else dashboard.
      router.push(data.mustChange ? "/access/admin/setup" : "/access/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex items-center justify-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-primary text-white">
          <Repeat className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold text-white">
          Convert<span className="text-primary">ly</span>
        </span>
      </div>

      <div className="rounded-[14px] border border-line bg-surface p-7 elev-raised">
        <div className="mb-6 flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <h1 className="text-lg font-bold text-white">Admin sign in</h1>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Username or email</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              className="w-full rounded-[8px] border border-line bg-bg px-3 py-2.5 text-sm text-white outline-none focus:border-primary"
              placeholder="Convertly"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-[8px] border border-line bg-bg px-3 py-2.5 text-sm text-white outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
