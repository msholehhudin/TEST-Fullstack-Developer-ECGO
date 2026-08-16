"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CabinetStatus } from "@/lib/types/cabinets";

const STATUS_OPTIONS: { value: CabinetStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Status" },
  { value: "ONLINE", label: "Online" },
  { value: "OFFLINE", label: "Offline" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

export function CabinetFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: {
  search: string;
  status: CabinetStatus | "ALL";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CabinetStatus | "ALL") => void;
}) {
  // Local, debounced copy so every keystroke doesn't trigger a fetch/URL push.
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (localSearch !== search) onSearchChange(localSearch);
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search cabinet or branch..."
          className="pl-8"
          aria-label="Search cabinet or branch"
        />
      </div>

      <Select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as CabinetStatus | "ALL")}
        aria-label="Filter by status"
        className="sm:w-40"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
