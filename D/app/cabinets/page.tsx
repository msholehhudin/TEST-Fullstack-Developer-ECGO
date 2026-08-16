import { Suspense } from "react";
import { CabinetDashboard } from "@/components/cabinets/CabinetDashboard";
import { CabinetTableSkeleton } from "@/components/cabinets/CabinetTableSkeleton";

export default function CabinetsPage() {
  return (
    <Suspense fallback={<CabinetTableSkeleton />}>
      <CabinetDashboard />
    </Suspense>
  );
}
