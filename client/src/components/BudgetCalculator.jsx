import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const groups = {
  fixed: [
    ["rent", "Aluguel/Moradia"],
    ["condo", "Condomínio"],
    ["energy", "Energia elétrica"],
    ["water", "Água"],
    ["internet", "Internet"],
    ["phone", "Telefone"],
    ["tv", "TV/Streaming"],
    ["otherFixed", "Outras contas fixas"],
  ],
  variable: [
    ["food", "Alimentação/mercado"],
    ["transport", "Transporte/combustível"],
    ["leisure", "Lazer/entretenimento"],
    ["clothes", "Roupas/compras"],
    ["health", "Saúde/farmácia"],
    ["otherVariable", "Outras despesas variáveis"],
  ],
  investment: [
    ["emergency", "Reserva de emergência"],
    ["treasury", "Tesouro Direto"],
    ["cdb", "CDB/LCI/LCA"],
    ["fii", "Fundos imobiliários"],
    ["otherInvestment", "Outros investimentos"],
  ],
};
const money = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const emptyValues = () =>
  Object.fromEntries(
    [
      "income",
      ...Object.values(groups)
        .flat()
        .map(([key]) => key),
    ].map((key) => [key, "0"]),
  );
export default function BudgetCalculator({ onBack, onLogin }) {
  const { user, saveBudget, getBudgets } = useAuth();
  const [month, setMonth] = useState("");
  const [values, setValues] = useState(emptyValues);
  const [saved, setSaved] = useState([]);
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    if (user)
      getBudgets()
        .then(({ data }) => setSaved(data))
        .catch(() => setFeedback("Não foi possível carregar os meses salvos."));
  }, [user]);
  const totals = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(groups).map(([group, fields]) => [
          group,
          fields.reduce((sum, [key]) => sum + (Number(values[key]) || 0), 0),
        ]),
      ),
    [values],
  );
  const income = Number(values.income) || 0;
  const expenses = totals.fixed + totals.variable;
  const total = expenses + totals.investment;
  const balance = income - total;
  const set = (key, value) => setValues({ ...values, [key]: value });
  const save = async () => {
    if (!user) {
      onLogin("orcamento");
      return;
    }
    if (!month) {
      setFeedback("Selecione um mês para salvar.");
      return;
    }
    try {
      const { data } = await saveBudget({
        month,
        income,
        fieldData: values,
        fixedExpenses: totals.fixed,
        variableExpenses: totals.variable,
        investments: totals.investment,
      });
      setSaved((old) =>
        [...old.filter((item) => item.month !== month), data.budget].sort(
          (a, b) => a.month.localeCompare(b.month),
        ),
      );
      setFeedback(
        `Orçamento de ${MONTHS[Number(month.slice(-2)) - 1]} 2026 salvo com sucesso.`,
      );
    } catch {
      setFeedback("Não foi possível salvar o orçamento.");
    }
  };
  const load = (value) => {
    setMonth(value);
    const item = saved.find((row) => row.month === value);
    if (item && item.fieldData && Object.keys(item.fieldData).length > 0) {
      setValues(item.fieldData);
    } else if (item) {
      const next = emptyValues();
      next.income = String(item.income || "0");
      setValues(next);
    }
  };
  return (
    <section id="orcamento" className="dashboard-section budget-section">
      <button className="btn btn-secondary" onClick={onBack}>
        ← Voltar para biblioteca
      </button>
      <div className="budget-month-selector">
        <label htmlFor="budget-month">Mês de referência:</label>
        <select
          id="budget-month"
          value={month}
          onChange={(e) => load(e.target.value)}
        >
          <option value="">Selecione um mês</option>
          {MONTHS.map((name, index) => (
            <option
              key={name}
              value={`2026-${String(index + 1).padStart(2, "0")}`}
            >
              {name} 2026
            </option>
          ))}
        </select>
        <button className="btn btn-secondary" onClick={save}>
          Salvar este mês
        </button>
        <span role="status">{feedback}</span>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Organize seu mês</p>
          <h2>Minha Planilha de Orçamento</h2>
        </div>
        <p>Atualização automática a cada valor informado.</p>
      </div>
      {!user && (
        <div className="budget-auth-banner">
          <p>
            <strong>Planilha protegida</strong> Faça login para usar a planilha
            de orçamento.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => onLogin("orcamento")}
          >
            Entrar
          </button>
        </div>
      )}
      <div className="budget-grid">
        <fieldset className="budget-block card">
          <legend>Renda</legend>
          <div className="budget-field">
            <label htmlFor="budget-income">Renda mensal (R$)</label>
            <input
              id="budget-income"
              type="number"
              min="0"
              step="0.01"
              value={values.income}
              onChange={(e) => set("income", e.target.value)}
            />
          </div>
        </fieldset>
        {Object.entries(groups).map(([group, fields]) => (
          <fieldset className="budget-block card" key={group}>
            <legend>
              {group === "fixed"
                ? "Contas Fixas"
                : group === "variable"
                  ? "Contas Não Fixas"
                  : "Investimentos"}
            </legend>
            {fields.map(([key, label]) => (
              <div className="budget-field" key={key}>
                <label htmlFor={`budget-${key}`}>{label}</label>
                <input
                  id={`budget-${key}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={values[key]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </div>
            ))}
          </fieldset>
        ))}
      </div>
      <div className="budget-results">
        <Result label="Total de contas fixas" value={totals.fixed} />
        <Result label="Total de contas não fixas" value={totals.variable} />
        <Result label="Total de investimentos" value={totals.investment} />
        <Result label="Total de gastos" value={total} />
        <Result label="Saldo final" value={balance} negative={balance < 0} />
        <Result
          label="Gastos sobre renda"
          value={income ? `${((total / income) * 100).toFixed(1)}%` : "0%"}
        />
        <Result
          label="Investimentos sobre renda"
          value={
            income
              ? `${((totals.investment / income) * 100).toFixed(1)}%`
              : "0%"
          }
        />
      </div>
      <div className="budget-bars card">
        <h3>Distribuição da renda</h3>
        <div className="budget-bar">
          <span
            className="bar-expenses"
            style={{
              width: `${income ? Math.min(100, (expenses / income) * 100) : 0}%`,
            }}
          />
          <span
            className="bar-investments"
            style={{
              width: `${income ? Math.min(100, (totals.investment / income) * 100) : 0}%`,
            }}
          />
          <span
            className="bar-free"
            style={{
              width: `${income ? Math.max(0, (balance / income) * 100) : 100}%`,
            }}
          />
        </div>
        <p className="budget-note">
          {income
            ? `Gastos: ${money(expenses)} · Investimentos: ${money(totals.investment)} · Livre: ${money(Math.max(0, balance))}`
            : "Informe a renda mensal para visualizar a distribuição."}
        </p>
      </div>
      <section className="budget-comparison">
        <h3>Comparativo de meses</h3>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <caption className="sr-only">
              Comparativo dos orçamentos salvos por mês
            </caption>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Renda</th>
                <th>Gastos</th>
                <th>Investimentos</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {saved.map((row) => (
                <tr key={row.month}>
                  <td>
                    {MONTHS[Number(row.month.slice(-2)) - 1].slice(0, 3)} 2026
                  </td>
                  <td>{money(row.income)}</td>
                  <td>{money(row.fixedExpenses + row.variableExpenses)}</td>
                  <td>{money(row.investments)}</td>
                  <td className={row.balance >= 0 ? "positive" : "negative"}>
                    {money(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
function Result({ label, value, negative }) {
  return (
    <div
      className={`budget-total card ${negative ? "is-negative" : "is-positive"}`}
    >
      <span>{label}</span>
      <strong>{typeof value === "number" ? money(value) : value}</strong>
    </div>
  );
}
