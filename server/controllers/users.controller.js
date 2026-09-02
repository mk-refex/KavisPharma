import bcrypt from "bcryptjs";
import { readJson, writeJson } from "../services/dataStore.js";

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || "active",
    createdAt: user.createdAt || null,
    lastActive: user.lastActive || null,
  };
}

async function loadUsers() {
  return (await readJson("users.json")) || [];
}

async function saveUsers(users) {
  await writeJson("users.json", users);
}

function nextId(users) {
  return users.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1;
}

export async function listUsers(_req, res) {
  try {
    const users = await loadUsers();
    return res.json(users.map(publicUser));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("List users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, password, role = "editor", status = "active" } =
      req.body || {};

    if (!name?.trim() || !email?.trim() || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!["admin", "editor"].includes(role)) {
      return res.status(400).json({ message: "Role must be admin or editor" });
    }

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be active or inactive" });
    }

    const users = await loadUsers();
    const emailNormalized = String(email).trim().toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === emailNormalized)) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const now = new Date().toISOString();
    const user = {
      id: nextId(users),
      name: String(name).trim(),
      email: emailNormalized,
      passwordHash: await bcrypt.hash(String(password), 10),
      role,
      status,
      createdAt: now,
      lastActive: null,
    };

    users.push(user);
    await saveUsers(users);

    return res.status(201).json(publicUser(user));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Create user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = Number(req.params.id);
    const users = await loadUsers();
    const index = users.findIndex((user) => user.id === userId);

    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, password, role, status } = req.body || {};

    if (email) {
      const emailNormalized = String(email).trim().toLowerCase();
      const taken = users.some(
        (user, i) =>
          i !== index && user.email.toLowerCase() === emailNormalized,
      );
      if (taken) {
        return res.status(400).json({ message: "Email already in use" });
      }
      users[index].email = emailNormalized;
    }

    if (name?.trim()) {
      users[index].name = String(name).trim();
    }

    if (role !== undefined) {
      if (!["admin", "editor"].includes(role)) {
        return res.status(400).json({ message: "Role must be admin or editor" });
      }
      users[index].role = role;
    }

    if (status !== undefined) {
      if (!["active", "inactive"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be active or inactive" });
      }
      users[index].status = status;
    }

    if (password) {
      if (String(password).length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      users[index].passwordHash = await bcrypt.hash(String(password), 10);
    }

    await saveUsers(users);
    return res.json(publicUser(users[index]));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = Number(req.params.id);

    if (req.user?.userId === userId) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const users = await loadUsers();
    const index = users.findIndex((user) => user.id === userId);

    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const remainingAdmins = users.filter(
      (user, i) => i !== index && user.role === "admin" && user.status !== "inactive",
    );
    if (users[index].role === "admin" && remainingAdmins.length === 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete the last active admin" });
    }

    users.splice(index, 1);
    await saveUsers(users);

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
