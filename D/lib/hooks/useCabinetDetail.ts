"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CabinetDetailResult } from "@/lib/types/cabinet-detail";
import { fetchCabinetDetail } from "../api/cabinet-detail";

type State =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; error: string }
  | { status: "success"; data: CabinetDetailResult };

export function useCabinetDetail(id: string) {
  const [state, setState] = useState<State>({ status: "loading" });
  const requestId = useRef(0);

  const load = useCallback(() => {
    const reqId = ++requestId.current;
    setState({ status: "loading" });

    fetchCabinetDetail(id)
      .then((data) => {
        if (reqId !== requestId.current) return;
        setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (reqId !== requestId.current) return;
        const message = err instanceof Error ? err.message : "Something went wrong";
        setState(
          message === "Cabinet not found"
            ? { status: "not-found" }
            : { status: "error", error: message }
        );
      });
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, retry: load };
}
