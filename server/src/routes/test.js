import { Router } from "express";
import { pool } from "../db.js";
import { verifyToken } from "../middleware/auth.js";
const router = Router();
router.use(verifyToken);
router.post("/", async (request, response, next) => {
  try {
    const { profile, answers } = request.body;
    if (!profile || !answers || typeof answers !== "object")
      return response
        .status(400)
        .json({ error: "Perfil e respostas são obrigatórios." });
    await pool.query(
      "INSERT INTO test_results (user_id, profile, answers) VALUES ($1, $2, $3)",
      [request.user.id, profile, JSON.stringify(answers)],
    );
    return response.status(201).json({ success: true });
  } catch (error) {
    return next(error);
  }
});
router.get("/", async (request, response, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT profile, answers FROM test_results WHERE user_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1",
      [request.user.id],
    );
    return response.json(rows[0] || null);
  } catch (error) {
    return next(error);
  }
});
export default router;
