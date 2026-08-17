"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

/**
 * Holds files handed off between the homepage drop zone and a per-format
 * converter route. A File object can't survive a URL navigation, so the
 * homepage stashes the dropped files here, navigates to /{ext}-converter,
 * and that page drains them into its workspace on mount.
 */
interface UploadHandoff {
  stash: (files: File[]) => void;
  drain: () => File[];
  hasPending: () => boolean;
  // Hero selection shared with the homepage upload box.
  heroSource: string;
  heroTarget: string;
  setHeroSource: (s: string) => void;
  setHeroTarget: (t: string) => void;
  // Whether the workspace currently has files loaded (hide hero when true).
  filesLoaded: boolean;
  setFilesLoaded: (v: boolean) => void;
}

const Ctx = createContext<UploadHandoff | null>(null);

export function UploadProvider({ children }: { children: ReactNode }) {
  const pending = useRef<File[]>([]);
  // bump forces consumers to re-check after a stash if needed
  const [, setTick] = useState(0);
  const [heroSource, setHeroSource] = useState("");
  const [heroTarget, setHeroTarget] = useState("");
  const [filesLoaded, setFilesLoaded] = useState(false);

  const stash = (files: File[]) => {
    pending.current = files;
    setTick((t) => t + 1);
  };
  const drain = () => {
    const f = pending.current;
    pending.current = [];
    return f;
  };
  const hasPending = () => pending.current.length > 0;

  return (
    <Ctx.Provider
      value={{ stash, drain, hasPending, heroSource, heroTarget, setHeroSource, setHeroTarget, filesLoaded, setFilesLoaded }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useUploadHandoff() {
  return useContext(Ctx);
}
