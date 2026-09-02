import jwt from "jsonwebtoken";

export function signToken(payload) {
  const secret = process.env.JWT_SECRET || "kavis_dev_secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign(payload, secret, { expiresIn });
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = header.slice("Bearer ".length);
  try {
    const secret = process.env.JWT_SECRET || "kavis_dev_secret";
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

/** Admins and editors can manage CMS content */
export function requireCmsAccess(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!["admin", "editor"].includes(req.user.role)) {
    return res.status(403).json({ message: "CMS access required" });
  }
  next();
}
