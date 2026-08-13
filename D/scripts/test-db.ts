import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({
  path: ".env.local",
});

console.log(
  "DATABASE_URL exists:",
  Boolean(process.env.DATABASE_URL),
);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();

    const result = await client.query("SELECT NOW()");

    console.log("Database connected successfully.");
    console.log("Database time:", result.rows[0].now);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

testConnection();