import { Router } from "express";
import { pool } from "../db.js";
import { verifyToken } from "../middleware/auth.js";
const router = Router();
router.use(verifyToken);
const numbers = (body) => ({
  income: Number(body.income) || 0,
  fixedExpenses: Number(body.fixedExpenses) || 0,
  investments: Number(body.investments) || 0,
  variableExpenses: Number(body.variableExpenses) || 0,
});
const shape = (row) => ({
  id: row.id,
  month: row.month,
  income: Number(row.income),
  fixedExpenses: Number(row.fixed_expenses),
  investments: Number(row.investments),
  variableExpenses: Number(row.variable_expenses),
  balance: Number(row.balance),
  fieldData: row.field_data || {},
});
router.post("/", async (request, response, next) => {
  try {
    const { month } = request.body;
    if (!/^2026-(0[1-9]|1[0-2])$/.test(month || ""))
      return response
        .status(400)
        .json({ error: "Informe um mês válido de 2026." });
    const values = numbers(request.body);
    const fieldData =
      request.body.fieldData && typeof request.body.fieldData === "object"
        ? request.body.fieldData
        : {};
        console.log("fieldData recebido:", JSON.stringify(fieldData));
    const balance =
      values.income -
      values.fixedExpenses -
      values.investments -
      values.variableExpenses;
    const sql = `INSERT INTO budgets (user_id, month, income, fixed_expenses, investments, variable_expenses, balance, field_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id, month) DO UPDATE SET
        income=EXCLUDED.income,
        fixed_expenses=EXCLUDED.fixed_expenses,
        investments=EXCLUDED.investments,
        variable_expenses=EXCLUDED.variable_expenses,
        balance=EXCLUDED.balance,
        field_data=EXCLUDED.field_data
      RETURNING *`;
    const { rows } = await pool.query(sql, [
      request.user.id,
      month,
      values.income,
      values.fixedExpenses,
      values.investments,
      values.variableExpenses,
      balance,
      JSON.stringify(fieldData),
    ]);
    return response.status(201).json({ budget: shape(rows[0]) });
  } catch (error) {
    return next(error);
  }
});
router.get("/", async (request, response, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM budgets WHERE user_id = $1 ORDER BY month",
      [request.user.id],
    );
    return response.json(rows.map(shape));
  } catch (error) {
    return next(error);
  }
});
router.get("/:month", async (request, response, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM budgets WHERE user_id = $1 AND month = $2",
      [request.user.id, request.params.month],
    );
    return response.json(rows[0] ? shape(rows[0]) : null);
  } catch (error) {
    return next(error);
  }
});
export default router;