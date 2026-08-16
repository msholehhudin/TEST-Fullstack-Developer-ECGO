import { AlertTriangle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CabinetEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <SearchX className="h-8 w-8 text-neutral-300" />
      <p className="text-sm font-medium text-neutral-900">No cabinets found</p>
      <p className="text-sm text-neutral-500">
        Try adjusting your search or filters.
      </p>
    </div>
  );
}

export function CabinetErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-rose-400" />
      <div>
        <p className="text-sm font-medium text-neutral-900">
          Unable to load cabinets
        </p>
        <p className="text-sm text-neutral-500">Please try again.</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
