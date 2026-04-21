import { signAdminToken } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { username = "", password = "" } = req.body || {};
    const expectedUsername = process.env.ADMIN_USERNAME || "owner";
    const expectedPassword = process.env.ADMIN_PASSWORD || "";

    const validLogin =
      username.trim() === expectedUsername && password === expectedPassword;

    if (!validLogin) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = signAdminToken();
    return res.status(200).json({ token, username: expectedUsername });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Login failed." });
  }
}
