import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

import http from "http";
import app from "./app.js";
import { seedDatabase } from "./services/seed.js";

const port = Number(process.env.PORT) || 3000;

async function start() {
  await seedDatabase();

  const server = http.createServer(app);
  server.listen(port, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port:${port}`);
    // console.log(`Client build: ${path.join(__dirname, "../client/out")}`);
    // console.log(`Uploads: ${path.join(__dirname, "uploads")}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", error);
  process.exit(1);
});
