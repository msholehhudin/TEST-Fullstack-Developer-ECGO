import { pool } from "@/lib/db";
import type { CabinetDetailResult } from "@/lib/types/cabinet-detail";

const CABINET_QUERY = `
  SELECT
    c.id,
    c.code,
    c.status,
    c.last_heartbeat_at,
    c.created_at,
    b.id AS branch_id,
    b.name AS branch_name
  FROM cabinets c
  INNER JOIN branches b
    ON b.id = c.branch_id
  WHERE c.id = $1
`;

const SLOTS_QUERY = `
  SELECT slot_number, state, soc_percent
  FROM slots
  WHERE cabinet_id = $1
  ORDER BY slot_number ASC
`;

// generate_series builds the 24 hour buckets first (so every hour is
// present even with zero swaps), then LEFT JOINs the actual counts onto it
// and COALESCEs the gaps to 0 — same shape as the slot_summary CTE in
// getCabinets, just generating the "left side" instead of reading it from
// a table.
const HOURLY_SWAPS_QUERY = `
  WITH hours AS (
    SELECT generate_series(
      date_trunc('hour', now() - interval '23 hours'),
      date_trunc('hour', now()),
      interval '1 hour'
    ) AS hour_start
  ),
  swaps AS (
    SELECT date_trunc('hour', swapped_at) AS hour_start, COUNT(*) AS count
    FROM swap_transactions
    WHERE cabinet_id = $1
      AND swapped_at >= now() - interval '24 hours'
    GROUP BY 1
  )
  SELECT h.hour_start, COALESCE(s.count, 0)::int AS count
  FROM hours h
  LEFT JOIN swaps s
    ON s.hour_start = h.hour_start
  ORDER BY h.hour_start ASC
`;

const RECENT_TRANSACTIONS_QUERY = `
  SELECT
    t.id,
    t.swapped_at,
    s.slot_number,
    t.battery_out_soc,
    t.battery_in_soc
  FROM swap_transactions t
  LEFT JOIN slots s
    ON s.id = t.slot_id
  WHERE t.cabinet_id = $1
  ORDER BY t.swapped_at DESC
  LIMIT 20
`;

export default async function getCabinetDetail(
  id: string
): Promise<CabinetDetailResult | null> {
  const [cabinetResult, slotsResult, hourlyResult, transactionsResult] =
    await Promise.all([
      pool.query(CABINET_QUERY, [id]),
      pool.query(SLOTS_QUERY, [id]),
      pool.query(HOURLY_SWAPS_QUERY, [id]),
      pool.query(RECENT_TRANSACTIONS_QUERY, [id]),
    ]);

  // Cabinet not found — let the route turn this into a 404. Note we still
  // ran all four queries in parallel above; bailing out before that would
  // save a little DB work on the not-found path, but it'd mean checking
  // existence serially before the rest, which slows down the common case
  // to save work on the rare one. Not worth it here.
  if (cabinetResult.rows.length === 0) return null;

  return {
    cabinet: cabinetResult.rows[0],
    slots: slotsResult.rows,
    hourlySwaps: hourlyResult.rows,
    recentTransactions: transactionsResult.rows,
  };
}
