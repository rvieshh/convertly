import { Trash2, ShieldCheck, Lock } from "lucide-react";

const POINTS = [
  {
    icon: Trash2,
    title: "Automatic deletion",
    body: "Uploaded and converted files are processed on the server and removed right after the job finishes. Nothing is kept.",
  },
  {
    icon: Lock,
    title: "No accounts, no tracking",
    body: "Convertly needs no sign-up. Your files aren't tied to an identity, and they're never used to train anything.",
  },
  {
    icon: ShieldCheck,
    title: "Open source",
    body: "The whole stack is public on GitHub. Audit exactly how your files are handled — or self-host it yourself.",
  },
];

export function DataSecurity() {
  return (
    <section className="border-t border-line/60">
      <div className="mx-auto max-w-[1200px] px-8 py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-white">Data Security</h2>
          <p className="mt-2 text-[15px] text-muted">
            Your files are yours. Convertly is built to touch them for as short a time as possible.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="elev-raised rounded-[14px] border border-white/[0.06] bg-surface p-6"
            >
              <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-primary/15 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
