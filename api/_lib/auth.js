import jwt from "jsonwebtoken";

export const signAdminToken = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return jwt.sign(
    {
      role: "admin",
      username: process.env.ADMIN_USERNAME || "owner"
    },
    secret,
    { expiresIn: "8h" }
  );
};

export const requireAdmin = (req) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    const error = new Error("Missing auth token.");
    error.statusCode = 401;
    throw error;
  }

  try {
    return jwt.verify(token, secret);
  } catch {
    const error = new Error("Invalid or expired auth token.");
    error.statusCode = 401;
    throw error;
  }
};
