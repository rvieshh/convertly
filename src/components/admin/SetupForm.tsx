"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export function SetupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setup failed");
      router.push("/access/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
      setLoading(false);
    }
  };

  const field = (
    label: string,
    value: string,
    set: (v: string) => void,
    type = "text",
    ac?: string,
  ) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
        autoComplete={ac}
        className="w-full rounded-[8px] border border-line bg-bg px-3 py-2.5 text-sm text-white outline-none focus:border-primary"
      />
    </div>
  );

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[14px] border border-line bg-surface p-7 elev-raised">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-white">Secure your admin account</h1>
        </div>
        <p className="mb-6 text-sm text-muted">
          You&apos;re signed in with the default credentials. Create your own admin login now — the
          defaults will stop working.
        </p>

        <form onSubmit={submit} className="space-y-4">
          {field("New username", username, setUsername, "text", "username")}
          {field("Email", email, setEmail, "email", "email")}
          {field("New password", password, setPassword, "password", "new-password")}
          {field("Confirm password", confirm, setConfirm, "password", "new-password")}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save and continue
          </button>
        </form>
      </div>
    </div>
  );
}
