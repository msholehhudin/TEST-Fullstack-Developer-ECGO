"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCabinets, type CabinetsResponse } from "@/lib/api/cabinets";
import type { GetCabinetsParams } from "@/lib/types/cabinets";

type State =
  | { status: "loading"; data?: CabinetsResponse }
  | { status: "error"; error: string }
  | { status: "success"; data: CabinetsResponse };

export function useCabinets(params: GetCabinetsParams) {
  const [state, setState] = useState<State>({ status: "loading" });
  const requestId = useRef(0);

  const paramsKey = JSON.stringify(params);

  const load = useCallback(() => {
    const id = ++requestId.current;
    setState((prev) =>
      prev.status === "success" ? { status: "loading", data: prev.data } : { status: "loading" }
    );

    fetchCabinets(JSON.parse(paramsKey))
      .then((data) => {
        if (id !== requestId.current) return;
        setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (id !== requestId.current) return;
        setState({
          status: "error",
          error: err instanceof Error ? err.message : "Something went wrong",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, retry: load };
}
