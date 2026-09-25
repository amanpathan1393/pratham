"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// The English site's root layout (header logos, floating blobs, narrow
// column) wraps every route, and we must not modify it. Rather than restyle
// around it, this shell is a full-screen surface that sits on top of it, so
// /experimento gets its own identity. The English chrome underneath is made
// inert while this is mounted so it can't take keyboard focus or be read by
// a screen reader, and is restored on unmount.
export function ExperimentoShell({
  fontClassName,
  children,
}: {
  fontClassName: string;
  children: React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    const hostChrome = Array.from(
      document.querySelectorAll<HTMLElement>("body > header, body > div[aria-hidden='true']"),
    );
    const previous = hostChrome.map((el) => el.inert);
    hostChrome.forEach((el) => {
      el.inert = true;
    });
    return () => {
      hostChrome.forEach((el, i) => {
        el.inert = previous[i];
      });
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      className={`exp-root fixed inset-0 z-[100] overflow-y-auto ${fontClassName}`}
    >
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5 pt-5 pb-12">
        {children}
      </div>
    </div>
  );
}
