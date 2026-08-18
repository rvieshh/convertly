"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { FooterEditor } from "@/components/admin/FooterEditor";

const FONTS = ["Inter", "Plus Jakarta Sans", "Roboto", "Poppins", "Montserrat"];

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      // Reload so the new theme/accent/font apply site-wide immediately.
      setTimeout(() => window.location.reload(), 400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-24">
      {/* Branding */}
      <Section title="Branding">
        <Text label="Site name" value={s.siteName} onChange={(v) => set("siteName", v)} />
        <Text label="Logo text (defaults to site name)" value={s.logoText} onChange={(v) => set("logoText", v)} />
        <Text label="Logo image URL (optional)" value={s.logoUrl} onChange={(v) => set("logoUrl", v)} placeholder="https://…/logo.png" />
      </Section>

      {/* Theme */}
      <Section title="Theme">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Mode</Label>
            <div className="flex gap-2">
              {(["dark", "light"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => set("theme", m)}
                  className={`flex-1 rounded-[8px] border px-3 py-2 text-sm capitalize ${
                    s.theme === m ? "border-primary bg-primary/15 text-white" : "border-line text-muted"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Font</Label>
            <select
              value={s.font}
              onChange={(e) => set("font", e.target.value)}
              className="w-full rounded-[8px] border border-line bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Color label="Accent color" value={s.accent} onChange={(v) => set("accent", v)} />
          <Color label="Accent hover" value={s.accentHover} onChange={(v) => set("accentHover", v)} />
        </div>
      </Section>

      {/* Features & limits */}
      <Section title="Features & limits">
        <Toggle
          label="Enable user Login / Register"
          hint="Replaces the “Star on GitHub” button with Login + Register."
          value={s.authEnabled}
          onChange={(v) => set("authEnabled", v)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Num label="Guest max uploads (0 = ∞)" value={s.guestMaxUploads} onChange={(v) => set("guestMaxUploads", v)} />
          <Num label="User max uploads (0 = ∞)" value={s.userMaxUploads} onChange={(v) => set("userMaxUploads", v)} />
          <Num label="Max file size (MB)" value={s.maxFileSizeMb} onChange={(v) => set("maxFileSizeMb", v)} />
        </div>
      </Section>

      {/* Footer */}
      <Section title="Footer">
        <Text label="Footer description" value={s.footerDescription} onChange={(v) => set("footerDescription", v)} textarea />
        <Text label="Copyright name (defaults to site name)" value={s.copyrightName} onChange={(v) => set("copyrightName", v)} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Text label="“Backed by” label" value={s.footerBackedByLabel} onChange={(v) => set("footerBackedByLabel", v)} />
          <Text label="Backed-by name" value={s.footerBackedByName} onChange={(v) => set("footerBackedByName", v)} />
          <Text label="Backed-by URL" value={s.footerBackedByUrl} onChange={(v) => set("footerBackedByUrl", v)} />
        </div>
        <FooterEditor columns={s.footerColumns} onChange={(cols) => set("footerColumns", cols)} />
      </Section>

      {/* Save bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-line bg-surface/95 px-6 py-3 backdrop-blur md:left-56">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-sm text-muted">
            {error ? <span className="text-danger">{error}</span> : saved ? "Saved — reloading…" : "Changes apply site-wide on save."}
          </span>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-[8px] bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[12px] border border-line bg-surface p-6">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium text-muted">{children}</label>;
}
function Text({ label, value, onChange, placeholder, textarea }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full rounded-[8px] border border-line bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-[8px] border border-line bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
      )}
    </div>
  );
}
function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type="number" min={0} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} className="w-full rounded-[8px] border border-line bg-bg px-3 py-2 text-sm text-white outline-none focus:border-primary" />
    </div>
  );
}
function Color({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-line bg-bg" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 rounded-[8px] border border-line bg-bg px-3 py-2 text-sm font-mono text-white outline-none focus:border-primary" />
      </div>
    </div>
  );
}
function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-surface-2"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
