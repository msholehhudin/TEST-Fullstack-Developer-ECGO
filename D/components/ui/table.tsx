import * as React from "react";
import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-neutral-200 bg-neutral-50/60", className)}
      {...props}
    />
  );
}

function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-neutral-100", className)}
      {...props}
    />
  );
}

function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("transition-colors hover:bg-neutral-50/80", className)}
      {...props}
    />
  );
}

function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-10 whitespace-nowrap px-4 text-left align-middle text-xs font-medium text-neutral-500",
        className
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "whitespace-nowrap px-4 py-3 align-middle text-neutral-800",
        className
      )}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
