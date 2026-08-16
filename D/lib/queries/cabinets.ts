import { pool } from "@/lib/db";
import { CabinetSortBy, GetCabinetsParams } from "../types/cabinets";

const getCabinets = async({
  search = "",
  status= "ALL",
  sortBy = "code",
  sortOrder = 'asc',
  page = 1,
  pageSize= 10 
}: GetCabinetsParams = {}) => {

  const SORT_COLUMNS:Record<CabinetSortBy, string> = {
    code: "c.code",
    status: "c.status",
    branch: "b.name",
    heartbeat: "c.last_heartbeat_at",
    swap24h: "swap_count_24h"
  }

  const offset = (page -1) * pageSize
  const conditions: string[] = []
  const values: unknown[] = []

  if(search.trim()){
    values.push(`%${search.trim()}%`)

    conditions.push(`
        c.code ILIKE $${values.length}
        OR b.name ILIKE $${values.length}
      `)
  }

  if(status !== 'ALL'){
    values.push(status)

    conditions.push(`
        c.status = $${values.length}
      `)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` :""

  const sortColumn = SORT_COLUMNS[sortBy] ?? SORT_COLUMNS.code
  const direction = sortOrder === "desc" ? "DESC" : "ASC"

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM cabinets c
    INNER JOIN branches b
      ON b.id = c.branch_id
    ${whereClause} 
  `

  const dataValues = [...values, pageSize, offset]

  const dataQuery = `
    WITH swap_24h AS (
      SELECT cabinet_id, COUNT(*) AS swap_count_24h
      FROM swap_transactions
      WHERE swapped_at >= now() - interval '24 hours'
      GROUP BY cabinet_id
    ),
    slot_summary AS (
      SELECT cabinet_id,
             COUNT(*) FILTER (WHERE state <> 'EMPTY') AS slots_filled,
             COUNT(*) AS slots_total
      FROM slots
      GROUP BY cabinet_id
    )
    SELECT
      c.id,
      c.code,
      c.status,
      c.last_heartbeat_at,
      c.created_at,
      b.id AS branch_id,
      b.name AS branch_name,
      COALESCE(s24.swap_count_24h, 0) AS swap_count_24h,
      COALESCE(ss.slots_filled, 0) AS slots_filled,
      COALESCE(ss.slots_total, 0) AS slots_total
    FROM cabinets c
    INNER JOIN branches b
      ON b.id = c.branch_id
    LEFT JOIN swap_24h s24
      ON s24.cabinet_id = c.id
    LEFT JOIN slot_summary ss
      ON ss.cabinet_id = c.id
    ${whereClause}
    ORDER BY ${sortColumn} ${direction}
    LIMIT $${dataValues.length - 1}
    OFFSET $${dataValues.length}
  `;

  const [countResult, dataResult] = await Promise.all([
    pool.query(countQuery, values),
    pool.query(dataQuery, dataValues)
  ])

  const total = countResult.rows[0].total

  return {
    data: dataResult.rows,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    },
  }
}

export default getCabinets