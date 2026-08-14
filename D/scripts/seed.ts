import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({
  path: ".env.local",
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const BRANCH_NAMES = [
  "Kemayoran",
  "Sunter",
  "Cakung",
  "Kelapa Gading",
  "Bekasi",
  "Tangerang",
  "Depok",
  "Bogor",
  "Bandung",
  "Jakarta Selatan",
];

const STATUSES = ["ONLINE", "OFFLINE", "MAINTENANCE"] as const;
const SLOT_STATES = ["EMPTY", "CHARGING", "FULL", "LOCKED", "FAULT"] as const;

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomStatus = (): (typeof STATUSES)[number] => {
  const r = Math.random();
  if (r < 0.8) return "ONLINE";
  if (r < 0.93) return "OFFLINE";
  return "MAINTENANCE";
}

const seed = async () => {
  try {
    await client.connect();

    console.log("Database connected.");

    await client.query("BEGIN");

    await client.query(`
      TRUNCATE
        swap_transactions,
        slots,
        cabinets,
        branches
      RESTART IDENTITY CASCADE
    `);

    // 1. BRANCHES
    const branchIds: string[] = [];

    for (const name of BRANCH_NAMES) {
        const result = await client.query(
            `
            INSERT INTO branches (name)
            VALUES ($1)
            RETURNING id
            `,
            [name],
        );

        branchIds.push(result.rows[0].id);
    }

    console.log(`Created ${branchIds.length} branches.`);

    // 2. CABINETS

    const cabinetIds: string[] = [];

    for (let i = 1; i <= 50; i++) {
        const code = `CAB-${String(i).padStart(3, "0")}`;

        const branchId = branchIds[(i - 1) % branchIds.length];
        const status = randomStatus();

        let lastHeartbeat: Date | null;
        if (status === "ONLINE") {
            lastHeartbeat = new Date(Date.now() - randomInt(0, 5) * 60 * 1000);
        } else if (Math.random() < 0.1) {
            lastHeartbeat = null;
        } else {
            lastHeartbeat = new Date(Date.now() - randomInt(1, 72) * 60 * 60 * 1000);
        }

        const result = await client.query(
            `
            INSERT INTO cabinets (
                code,
                branch_id,
                status,
                last_heartbeat_at
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [
            code,
            branchId,
            status,
            lastHeartbeat
            ],
        );

        cabinetIds.push(result.rows[0].id);
    }

    console.log(`Created ${cabinetIds.length} cabinets.`);

    // 3. Slots
    let slotCount = 0;
    const slotIdsByCabinet: Record<string, string[]> = {};
    for (const cabinetId of cabinetIds) {
        slotIdsByCabinet[cabinetId] = [];
        for (let slotNumber = 1; slotNumber <= 12; slotNumber++) {
                const state = SLOT_STATES[randomInt(0, SLOT_STATES.length -1)];
                const soc =
                    state === "EMPTY" ? null
                    : state === "FULL" ? 100
                    : state === "CHARGING" ? randomInt(10, 95)
                    : state === "FAULT" ? randomInt(0, 100)
                    : randomInt(20, 100); // LOCKED
        
                const { rows } = await client.query(
                    `
                        INSERT INTO slots (
                            cabinet_id,
                            slot_number,
                            state,
                            soc_percent
                        )
                        VALUES ($1, $2, $3, $4)
                        RETURNING id
                    `,
                    [cabinetId, slotNumber, state, soc]
                );
            slotIdsByCabinet[cabinetId].push(rows[0].id);
            slotCount++
        }
    }

    console.log(`Created ${slotCount} slots.`);

    

    console.log("Existing data cleared.");

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seed();