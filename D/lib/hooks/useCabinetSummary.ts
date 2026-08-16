"use client";

import { useEffect, useState } from "react";
import { fetchCabinets } from "@/lib/api/cabinets";
import type { CabinetStatus } from "@/lib/types/cabinets";

export type CabinetSummary = {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
};

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; summary: CabinetSummary };

/**
 * The API has no dedicated stats endpoint, and we're not touching the
 * backend for this take-home. Each status count is real data straight from
 * `pagination.total` on a pageSize=1 request scoped to that status — not a
 * client-side estimate, just four thin calls to the endpoint that already
 * exists.
 */
export function useCabinetSummary() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const statuses: CabinetStatus[] = ["ONLINE", "OFFLINE", "MAINTENANCE"];
        const [all, ...byStatus] = await Promise.all([
          fetchCabinets({ page: 1, pageSize: 1 }),
          ...statuses.map((status) =>
            fetchCabinets({ page: 1, pageSize: 1, status })
          ),
        ]);

        if (cancelled) return;

        setState({
          status: "success",
          summary: {
            total: all.pagination.total,
            online: byStatus[0].pagination.total,
            offline: byStatus[1].pagination.total,
            maintenance: byStatus[2].pagination.total,
          },
        });
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
