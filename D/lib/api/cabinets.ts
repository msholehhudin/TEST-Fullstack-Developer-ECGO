import type { Cabinet, GetCabinetsParams } from "@/lib/types/cabinets";

export type CabinetsPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type CabinetsResponse = {
  data: Cabinet[];
  pagination: CabinetsPagination;
};

function buildQuery(params: GetCabinetsParams): string {
  const search = new URLSearchParams();
  if (params.search) search.set("search", params.search);
  if (params.status && params.status !== "ALL")
    search.set("status", params.status);
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchCabinets(
  params: GetCabinetsParams,
  init?: RequestInit
): Promise<CabinetsResponse> {
  const res = await fetch(`/api/cabinets${buildQuery(params)}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (json && typeof json === "object" && "error" in json && json.error) ||
      "Failed to fetch cabinets";
    throw new Error(String(message));
  }

  // NOTE: the current route handler returns `{ result }` where `result` is
  // whatever lib/queries/cabinets.ts resolves to, instead of the documented
  // flat `{ data, pagination }` shape. Unwrap defensively so the UI keeps
  // working either way — see the note left for the API route.
  const payload =
    json && typeof json === "object" && "result" in json
      ? (json as { result: unknown }).result
      : json;

  if (
    !payload ||
    typeof payload !== "object" ||
    !("data" in payload) ||
    !("pagination" in payload)
  ) {
    throw new Error("Unexpected response shape from /api/cabinets");
  }

  return payload as CabinetsResponse;
}
