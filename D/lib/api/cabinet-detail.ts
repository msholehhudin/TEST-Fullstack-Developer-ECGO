import type { CabinetDetailResult } from "@/lib/types/cabinet-detail";

export async function fetchCabinetDetail(
  id: string,
  init?: RequestInit
): Promise<CabinetDetailResult> {
  const res = await fetch(`/api/cabinets/${id}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (json && typeof json === "object" && "error" in json && json.error) ||
      "Failed to fetch cabinet detail";
    throw new Error(String(message));
  }

  return json as CabinetDetailResult;
}
