"use client";

import Link from "next/link";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { useEffect, useState } from "react";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const TOTAL_SLOTS = 12;

export default function Home() {
  const [litIndex, setLitIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) return;

    const id = setInterval(() => {
      setLitIndex((i) => (i + 1) % TOTAL_SLOTS);
    }, 380);
    return () => clearInterval(id);
  }, []);

  const litSet = new Set(
    reduceMotion
      ? Array.from({ length: TOTAL_SLOTS }, (_, i) => i)
      : [litIndex, (litIndex + 1) % TOTAL_SLOTS, (litIndex + 2) % TOTAL_SLOTS],
  );

  return (
    <div
      className={`${display.variable} ${mono.variable} relative max-h-svh overflow-x-hidden bg-[#0A1E1A] text-[#F2FBF6]`}
    >
      {/* ambient control-room backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 900px 500px at 12% -10%, rgba(124,255,196,0.10), transparent 60%), radial-gradient(ellipse 700px 500px at 100% 10%, rgba(255,194,75,0.07), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,255,196,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(124,255,196,0.045) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1080px] px-7">
        {/* top bar */}
        <header className="flex flex-col items-start gap-3.5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="relative flex h-[9px] w-[9px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7CFFC4] opacity-60" />
              <span className="relative inline-flex h-[9px] w-[9px] rounded-full bg-[#7CFFC4] shadow-[0_0_0_4px_rgba(124,255,196,0.15)]" />
            </span>
            ECGO
          </div>
          <div
            className="flex items-center gap-2 rounded-full border border-[#7CFFC4]/20 bg-[#7CFFC4]/[0.04] px-3.5 py-[7px] text-xs text-[#82A79A]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7CFFC4]" />
            Network normal · 50 cabinets reporting
          </div>
        </header>

        {/* hero */}
        <main className="py-24 text-center sm:py-28">
          <span
            className="mb-5 inline-block text-xs uppercase tracking-[0.16em] text-[#FFC24B] opacity-0 animate-[rise_0.7s_ease_forwards]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ECGO · Battery Swap Network
          </span>

          <h1
            className="mx-auto text-[38px] font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block opacity-0 animate-[rise_0.7s_ease_forwards] [animation-delay:0.08s]">
              Every cabinet.
            </span>
            <span className="block bg-gradient-to-r from-[#7CFFC4] to-[#B9FFDE] bg-clip-text text-transparent opacity-0 animate-[rise_0.7s_ease_forwards] [animation-delay:0.36s]">
              Watched live.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[560px] text-base leading-relaxed text-[#82A79A] opacity-0 animate-[rise_0.7s_ease_forwards] [animation-delay:0.5s]">
            A real-time control room for ECGO&apos;s battery-swap fleet —
            cabinet health, slot occupancy, and swap activity across every
            branch, updated as it happens.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4 opacity-0 animate-[rise_0.7s_ease_forwards] [animation-delay:0.62s]">
            <Link
              href="/cabinets"
              className="group inline-flex items-center gap-2.5 rounded-[10px] bg-[#7CFFC4] px-7 py-[15px] text-[15.5px] font-semibold text-[#0A1E1A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8FFFCF] hover:shadow-[0_12px_28px_-8px_rgba(124,255,196,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2FBF6]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Enter Monitoring
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            {/* <Link
              href="/cabinet/CAB-001"
              className="inline-flex items-center rounded-[10px] border border-[#F2FBF6]/[0.18] px-5.5 py-3.5 text-[13.5px] text-[#F2FBF6] transition-colors duration-200 hover:border-[#7CFFC4]/50 hover:bg-[#7CFFC4]/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7CFFC4]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              View a cabinet →
            </Link> */}
          </div>

          {/* signature: live cabinet rig */}
          <div
            aria-hidden
            className="mx-auto mt-8 max-w-[640px] rounded-[20px] border border-[#7CFFC4]/[0.14] bg-gradient-to-b from-[#0F2620] to-[#153229] p-7 pb-5 opacity-0 animate-[rise_0.8s_ease_forwards] [animation-delay:0.75s]"
          >
            <div
              className="mb-5 flex items-baseline justify-between text-[11.5px] tracking-wide text-[#82A79A]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span>
                CAB-001{" "}
                <b className="font-medium text-[#F2FBF6]">· Kemayoran</b>
              </span>
              <span>Slot scan</span>
            </div>

            <div className="mb-5 grid grid-cols-4 gap-2.5 sm:grid-cols-6">
              {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                <div
                  key={i}
                  className={`relative aspect-square overflow-hidden rounded-[6px] border transition-colors duration-300 ${
                    litSet.has(i)
                      ? "border-[#7CFFC4]/50"
                      : "border-[#F2FBF6]/[0.08]"
                  } bg-[#F2FBF6]/[0.05]`}
                >
                  <div
                    className={`absolute inset-0 rounded-[6px] bg-[#7CFFC4] transition-all duration-300 ${
                      litSet.has(i)
                        ? "scale-100 opacity-90 shadow-[0_0_16px_2px_rgba(124,255,196,0.5)]"
                        : "scale-[0.4] opacity-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            <svg
              className="block h-[46px] w-full"
              viewBox="0 0 340 46"
              preserveAspectRatio="none"
            >
              <path
                d="M0,23 L60,23 L74,6 L88,40 L102,23 L340,23"
                fill="none"
                stroke="#7CFFC4"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
                style={{
                  strokeDasharray: 340,
                  strokeDashoffset: 340,
                  animation: reduceMotion
                    ? undefined
                    : "draw 3.2s linear infinite",
                }}
              />
            </svg>

            <div
              className="mt-2.5 flex justify-between text-[11px] text-[#82A79A]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span>
                Last heartbeat <span className="text-[#7CFFC4]">2s ago</span>
              </span>
              <span>12 / 12 slots online</span>
            </div>
          </div>

          {/* stat strip */}
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#7CFFC4]/[0.14] bg-[#7CFFC4]/[0.14] opacity-0 animate-[rise_0.8s_ease_forwards] [animation-delay:0.9s] sm:grid-cols-4">
            <div className="bg-[#0F2620] px-5 py-6 text-center">
              <div
                className="text-[30px] font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                50
              </div>
              <div
                className="mt-1.5 text-[11px] uppercase tracking-wide text-[#82A79A]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Total cabinets
              </div>
            </div>
            <div className="bg-[#0F2620] px-5 py-6 text-center">
              <div
                className="text-[30px] font-semibold text-[#7CFFC4]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                24/7
              </div>
              <div
                className="mt-1.5 text-[11px] uppercase tracking-wide text-[#82A79A]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Operational visibility
              </div>
            </div>
            <div className="bg-[#0F2620] px-5 py-6 text-center">
              <div
                className="text-[30px] font-semibold text-[#FF8A8A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                12
              </div>
              <div
                className="mt-1.5 text-[11px] uppercase tracking-wide text-[#82A79A]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Slots per cabinet
              </div>
            </div>
            <div className="bg-[#0F2620] px-5 py-6 text-center">
              <div
                className="text-[30px] font-semibold text-[#FFC24B]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Real-time
              </div>
              <div
                className="mt-1.5 text-[11px] uppercase tracking-wide text-[#82A79A]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Swap monitoring
              </div>
            </div>
          </div>
        </main>

        {/* footer / credit */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#7CFFC4]/[0.14] py-8">
          <div className="text-[13.5px] leading-relaxed text-[#82A79A]">
            Built by{" "}
            <b className="font-medium text-[#F2FBF6]">Muhammad Sholehhudin</b> —
            Full Stack Developer
            <br />
            ECGO Battery Swap Monitoring
          </div>
          <div
            className="rounded-full border border-[#F2FBF6]/[0.14] px-3 py-1.5 text-[11px] text-[#82A79A]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            v1.0
          </div>
        </footer>
      </div>
    </div>
  );
}
