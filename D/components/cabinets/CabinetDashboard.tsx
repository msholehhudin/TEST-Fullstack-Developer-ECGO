"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CabinetFilters } from "@/components/cabinets/CabinetFilters";
import { CabinetSummaryCards } from "@/components/cabinets/CabinetSummaryCards";
import { CabinetTable } from "@/components/cabinets/CabinetTable";
import { CabinetTableSkeleton } from "@/components/cabinets/CabinetTableSkeleton";
import { CabinetPagination } from "@/components/cabinets/CabinetPagination";
import {
  CabinetEmptyState,
  CabinetErrorState,
} from "@/components/cabinets/CabinetTableStates";
import { useCabinets } from "@/lib/hooks/useCabinets";
import { useCabinetSummary } from "@/lib/hooks/useCabinetSummary";
import type {
  CabinetSortBy,
  CabinetStatus,
  GetCabinetsParams,
} from "@/lib/types/cabinets";

const PAGE_SIZE = 10;

export function CabinetDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params: Required<Pick<GetCabinetsParams, "page" | "pageSize">> &
    GetCabinetsParams = useMemo(() => {
    const search = searchParams.get("search") ?? "";
    const status =
      (searchParams.get("status") as CabinetStatus | "ALL") || "ALL";
    const sortBy = (searchParams.get("sortBy") as CabinetSortBy) || undefined;
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
    const page = Number(searchParams.get("page")) || 1;

    return {
      search: search || undefined,
      status,
      sortBy,
      sortOrder,
      page,
      pageSize: PAGE_SIZE,
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (
      updates: Record<string, string | number | undefined>,
      resetPage = true,
    ) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "" || value === "ALL") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }

      if (resetPage) next.delete("page");

      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const cabinetsState = useCabinets(params);
  const { status, retry } = cabinetsState;
  const data = status === "error" ? undefined : cabinetsState.data;
  const summaryState = useCabinetSummary();

  const handleSort = useCallback(
    (column: CabinetSortBy) => {
      const isActive = params.sortBy === column;
      const nextOrder = isActive && params.sortOrder === "asc" ? "desc" : "asc";
      updateParams({ sortBy: column, sortOrder: nextOrder });
    },
    [params.sortBy, params.sortOrder, updateParams],
  );

  const cabinets = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="flex w-full flex-col gap-6 px-6 py-8 lg:px-10">
      <div>
        <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
          Green City Traffic
        </p>
        <h1 className="mt-1 text-xl font-semibold text-neutral-900">
          Cabinet Monitoring
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Monitor cabinet availability and battery activity.
        </p>
      </div>

      <CabinetSummaryCards state={summaryState} />

      <Card>
        <div className="flex flex-col gap-3 p-4">
          <CabinetFilters
            search={params.search ?? ""}
            status={params.status as CabinetStatus | "ALL"}
            onSearchChange={(value) => updateParams({ search: value })}
            onStatusChange={(value) => updateParams({ status: value })}
          />
        </div>

        <Separator />

        {status === "loading" && !data ? (
          <CabinetTableSkeleton />
        ) : status === "error" ? (
          <CabinetErrorState onRetry={retry} />
        ) : cabinets.length === 0 ? (
          <CabinetEmptyState />
        ) : (
          <CabinetTable
            cabinets={cabinets}
            sortBy={params.sortBy}
            sortOrder={params.sortOrder ?? "asc"}
            onSort={handleSort}
          />
        )}

        {pagination && cabinets.length > 0 && (
          <CabinetPagination
            pagination={pagination}
            onPageChange={(page) => updateParams({ page }, false)}
          />
        )}
      </Card>
    </div>
  );
}
