import { pool } from "@/lib/db";

export async function getCabinets() {
  const { rows } = await pool.query(`
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
    ORDER BY c.created_at DESC
  `);

  return rows;
}