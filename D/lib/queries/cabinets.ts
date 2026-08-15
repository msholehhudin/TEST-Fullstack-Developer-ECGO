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