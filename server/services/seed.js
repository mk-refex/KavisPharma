import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readJson, writeJson } from "./dataStore.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ABOUT = JSON.parse(
  readFileSync(join(__dirname, "../data/about.json"), "utf-8"),
);
const DEFAULT_CAREER = JSON.parse(
  readFileSync(join(__dirname, "../data/career.json"), "utf-8"),
);
const DEFAULT_CONTACT = JSON.parse(
  readFileSync(join(__dirname, "../data/contact.json"), "utf-8"),
);
const DEFAULT_HOME_FILE = JSON.parse(
  readFileSync(join(__dirname, "../data/home.json"), "utf-8"),
);

export async function seedDatabase() {
  const users = await readJson("users.json");
  if (!users?.length) {
    const email = process.env.ADMIN_EMAIL || "admin@kavispharma.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@123";
    const passwordHash = await bcrypt.hash(password, 10);

    await writeJson("users.json", [
      {
        id: 1,
        email,
        name: "CMS Admin",
        passwordHash,
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
        lastActive: null,
      },
    ]);

    // eslint-disable-next-line no-console
    console.log(`Seeded admin user: ${email}`);
  } else {
    let changed = false;
    const migrated = users.map((user) => {
      const next = { ...user };
      if (!next.status) {
        next.status = "active";
        changed = true;
      }
      if (!next.createdAt) {
        next.createdAt = new Date().toISOString();
        changed = true;
      }
      if (next.lastActive === undefined) {
        next.lastActive = null;
        changed = true;
      }
      return next;
    });
    if (changed) {
      await writeJson("users.json", migrated);
      // eslint-disable-next-line no-console
      console.log("Migrated users.json with status/createdAt fields");
    }
  }

  const home = await readJson("home.json");
  if (!home) {
    await writeJson("home.json", DEFAULT_HOME_FILE);
    // eslint-disable-next-line no-console
    console.log("Seeded default home page content");
  } else if (!home.sectionImages) {
    await writeJson("home.json", {
      ...home,
      sectionImages: DEFAULT_HOME_FILE.sectionImages,
    });
    // eslint-disable-next-line no-console
    console.log("Merged default home section images");
  }

  const about = await readJson("about.json");
  if (!about) {
    await writeJson("about.json", DEFAULT_ABOUT);
    // eslint-disable-next-line no-console
    console.log("Seeded default about page content");
  }

  const career = await readJson("career.json");
  if (!career) {
    await writeJson("career.json", DEFAULT_CAREER);
    // eslint-disable-next-line no-console
    console.log("Seeded default career page content");
  }

  const contact = await readJson("contact.json");
  if (!contact) {
    await writeJson("contact.json", DEFAULT_CONTACT);
    // eslint-disable-next-line no-console
    console.log("Seeded default contact page content");
  }
}
