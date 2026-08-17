import type { CabinetStatus } from "./cabinets";

export type CabinetDetailInfo = {
  id: string;
  code: string;
  status: CabinetStatus;
  last_heartbeat_at: string | null;
  created_at: string;
  branch_id: string;
  branch_name: string;
};

export type SlotState = "EMPTY" | "CHARGING" | "FULL" | "LOCKED" | "FAULT";

export type CabinetSlot = {
  slot_number: number;
  state: SlotState;
  soc_percent: number | null;
};

export type HourlySwapPoint = {
  hour_start: string; // ISO timestamp, start of the hour, UTC
  count: number;
};

export type CabinetTransaction = {
  id: string;
  swapped_at: string;
  slot_number: number | null;
  battery_out_soc: number | null;
  battery_in_soc: number | null;
};

export type CabinetDetailResult = {
  cabinet: CabinetDetailInfo;
  slots: CabinetSlot[];
  hourlySwaps: HourlySwapPoint[];
  recentTransactions: CabinetTransaction[];
};
