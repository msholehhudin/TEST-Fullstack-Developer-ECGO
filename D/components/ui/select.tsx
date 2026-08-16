import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative inline-block">
        <select
          ref={ref}
          className={cn(
            "h-9 w-full appearance-none rounded-md border border-neutral-200 bg-white pl-3 pr-8 text-sm text-neutral-900 shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
