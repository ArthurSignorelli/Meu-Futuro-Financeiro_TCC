import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
const publicUser = (row) => ({ id: row.id, name: row.name, email: row.email });
const tokenFor = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET || "dev-only-secret",
    { expiresIn: "7d" },
  );

router.post("/register", async (request, response, next) => {
  try {
    const { name, email, password } = request.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6)
      return response
        .status(400)
        .json({
          error:
            "Nome, e-mail e senha de pelo menos 6 caracteres são obrigatórios.",
        });
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [
      normalizedEmail,
    ]);
    if (exists.rowCount)
      return response
        .status(409)
        .json({ error: "Este e-mail já está cadastrado." });
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name.trim(), normalizedEmail, hash],
    );
    return response
      .status(201)
      .json({ token: tokenFor(rows[0]), user: publicUser(rows[0]) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const { rows } = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email?.trim().toLowerCase()],
    );
    if (
      !rows[0] ||
      !(await bcrypt.compare(password || "", rows[0].password_hash))
    )
      return response
        .status(401)
        .json({ error: "E-mail ou senha incorretos." });
    return response.json({
      token: tokenFor(rows[0]),
      user: publicUser(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", verifyToken, async (request, response, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [request.user.id],
    );
    if (!rows[0])
      return response.status(404).json({ error: "Usuário não encontrado." });
    return response.json({ user: publicUser(rows[0]) });
  } catch (error) {
    return next(error);
  }
});
export default router;
