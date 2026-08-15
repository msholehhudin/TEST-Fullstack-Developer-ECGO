export type CabinetStatus =
  | "ONLINE"
  | "OFFLINE"
  | "MAINTENANCE";

export type CabinetSortBy =
  | "code"
  | "status"
  | "branch"
  | "heartbeat"
  | "swap24h";

export type SortOrder = "asc" | "desc";

export type GetCabinetsParams = {
  search?: string;
  status?: CabinetStatus | "ALL";
  sortBy?: CabinetSortBy;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
};

export type Cabinet = {
  id: string;
  code: string;
  status: CabinetStatus;
  last_heartbeat_at: string | null;
  created_at: string;
  branch_id: string;
  branch_name: string;
  swap_count_24h: number;
  slots_filled: number;
  slots_total: number;
};