import bcrypt from "bcryptjs";
import { readJson, writeJson } from "../services/dataStore.js";
import { signToken } from "../middleware/auth.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const users = (await readJson("users.json")) || [];
    const user = users.find(
      (entry) => entry.email.toLowerCase() === String(email).toLowerCase(),
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if ((user.status || "active") === "inactive") {
      return res.status(403).json({ message: "Account is inactive. Contact an admin." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastActive = new Date().toISOString();
    if (!user.status) user.status = "active";
    if (!user.createdAt) user.createdAt = new Date().toISOString();

    const index = users.findIndex((entry) => entry.id === user.id);
    if (index !== -1) {
      users[index] = user;
      await writeJson("users.json", users);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status || "active",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMe(req, res) {
  try {
    const users = (await readJson("users.json")) || [];
    const user = users.find((entry) => entry.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status || "active",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const users = (await readJson("users.json")) || [];
    const index = users.findIndex((entry) => entry.id === req.user.userId);

    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name } = req.body || {};
    if (name) {
      users[index].name = name;
      await writeJson("users.json", users);
    }

    const user = users[index];
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
