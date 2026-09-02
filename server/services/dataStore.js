import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "../data");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readJson(filename) {
  await ensureDataDir();
  const filePath = path.join(dataDir, filename);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function writeJson(filename, data) {
  await ensureDataDir();
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
