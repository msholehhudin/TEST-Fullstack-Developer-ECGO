import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight, dependency-free tooltip. Drop-in visually compatible with
 * shadcn's Tooltip usage pattern (Tooltip > trigger + content), but only
 * needs a group hover/focus — no portal, no JS state.
 */
function Tooltip({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("group relative inline-flex", className)}
      {...props}
    >
      {children}
    </span>
  );
}

function TooltipContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute -top-1.5 left-1/2 z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs text-neutral-50 opacity-0 shadow-md transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100",
        className
      )}
      {...props}
    />
  );
}

export { Tooltip, TooltipContent };
