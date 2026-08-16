import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-900 shadow-xs transition-colors placeholder:text-neutral-400 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
