export type CabinetStatus =
  | "ONLINE"
  | "OFFLINE"
  | "MAINTENANCE";

export type CabinetSortBy =
  | "code"
  | "status"
  | "branch"
  | "heartbeat";

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
};