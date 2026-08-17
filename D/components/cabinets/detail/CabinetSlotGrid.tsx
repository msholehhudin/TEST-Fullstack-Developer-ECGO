import {
  Battery,
  BatteryCharging,
  BatteryFull,
  Lock,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CabinetSlot, SlotState } from "@/lib/types/cabinet-detail";

// EMPTY stays unfilled/dashed — nothing physically there. Everything else
// gets a solid, saturated fill instead of a pastel tint, so the five
// states read as five distinct signals at a glance rather than "same card,
// different accent color."
const STATE_CONFIG: Record<
  SlotState,
  {
    label: string;
    card: string;
    text: string;
    icon: typeof Battery;
    iconColor: string;
  }
> = {
  EMPTY: {
    label: "Empty",
    card: "border-2 border-dashed border-neutral-200 bg-transparent",
    text: "text-neutral-400",
    icon: Battery,
    iconColor: "text-neutral-300",
  },
  CHARGING: {
    label: "Charging",
    card: "border border-amber-600 bg-amber-500",
    text: "text-white",
    icon: BatteryCharging,
    iconColor: "text-white",
  },
  FULL: {
    label: "Full",
    card: "border border-emerald-700 bg-emerald-600",
    text: "text-white",
    icon: BatteryFull,
    iconColor: "text-white",
  },
  LOCKED: {
    label: "Locked",
    card: "border border-indigo-700 bg-indigo-600",
    text: "text-white",
    icon: Lock,
    iconColor: "text-white",
  },
  FAULT: {
    label: "Fault",
    card: "border border-rose-700 bg-rose-600",
    text: "text-white",
    icon: TriangleAlert,
    iconColor: "text-white",
  },
};

const ALL_STATES: SlotState[] = [
  "EMPTY",
  "CHARGING",
  "FULL",
  "LOCKED",
  "FAULT",
];

export function CabinetSlotGrid({ slots }: { slots: CabinetSlot[] }) {
  // Always render 12 positions even if the API returned fewer rows for
  // some reason — a missing slot row shouldn't silently shrink the grid.
  const bySlotNumber = new Map(slots.map((slot) => [slot.slot_number, slot]));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((slotNumber) => {
          const slot = bySlotNumber.get(slotNumber);
          const state = slot?.state ?? "EMPTY";
          const config = STATE_CONFIG[state];
          const Icon = config.icon;

          return (
            <div
              key={slotNumber}
              className={cn(
                "flex flex-col gap-3 rounded-lg px-3 py-3",
                config.card,
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "text-[11px] font-medium tracking-wide",
                    state === "EMPTY" ? "text-neutral-400" : "text-white/70",
                  )}
                >
                  SLOT {slotNumber}
                </span>
                <Icon className={cn("h-4 w-4", config.iconColor)} />
              </div>

              <div>
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums leading-none",
                    config.text,
                  )}
                >
                  {slot?.soc_percent != null ? `${slot.soc_percent}%` : "—"}
                </p>
                <p
                  className={cn(
                    "mt-1 text-xs font-medium",
                    state === "EMPTY" ? "text-neutral-400" : "text-white/80",
                  )}
                >
                  {config.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {ALL_STATES.map((state) => {
          const Icon = STATE_CONFIG[state].icon;
          return (
            <span
              key={state}
              className="flex items-center gap-1.5 text-xs text-neutral-500"
            >
              <Icon className="h-3.5 w-3.5 text-neutral-400" />
              {STATE_CONFIG[state].label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
