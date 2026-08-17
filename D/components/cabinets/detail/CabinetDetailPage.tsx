"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, SearchX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { CabinetDetailHeader } from "@/components/cabinets/detail/CabinetDetailHeader";
import { CabinetSlotGrid } from "@/components/cabinets/detail/CabinetSlotGrid";
import { CabinetSwapChart } from "@/components/cabinets/detail/CabinetSwapChart";
import { CabinetTransactionsList } from "@/components/cabinets/detail/CabinetTransactionsList";
import { useCabinetDetail } from "@/lib/hooks/useCabinetDetail";

export function CabinetDetailPage() {
  const params = useParams<{ id: string }>();
  const detailState = useCabinetDetail(params.id);

  if (detailState.status === "loading") {
    return (
      <div className="mx-auto flex w-full flex-col gap-6 px-6 py-8 lg:px-10">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (detailState.status === "not-found") {
    return (
      <div className="mx-auto flex w-full flex-col items-center gap-3 px-6 py-24 text-center">
        <SearchX className="h-8 w-8 text-neutral-300" />
        <p className="text-sm font-medium text-neutral-900">
          Cabinet not found
        </p>
        <p className="text-sm text-neutral-500">
          It may have been removed, or the link is incorrect.
        </p>
        <Link
          href="/cabinets"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Back to cabinets
        </Link>
      </div>
    );
  }

  if (detailState.status === "error") {
    return (
      <div className="mx-auto flex w-full  flex-col items-center gap-3 px-6 py-24 text-center">
        <AlertTriangle className="h-8 w-8 text-rose-400" />
        <p className="text-sm font-medium text-neutral-900">
          Unable to load cabinet
        </p>
        <p className="text-sm text-neutral-500">Please try again.</p>
        <Button variant="outline" size="sm" onClick={detailState.retry}>
          Retry
        </Button>
      </div>
    );
  }

  // TypeScript now knows detailState.status === "success", so
  // detailState.data is available without a cast.
  const { cabinet, slots, hourlySwaps, recentTransactions } = detailState.data;

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-6 py-8 lg:px-10">
      <CabinetDetailHeader cabinet={cabinet} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-900">
            Slot Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CabinetSlotGrid slots={slots} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-900">
            Swaps — Last 24 Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CabinetSwapChart points={hourlySwaps} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-900">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CabinetTransactionsList transactions={recentTransactions} />
      </Card>
    </div>
  );
}
