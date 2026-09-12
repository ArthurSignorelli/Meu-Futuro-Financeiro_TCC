import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const QUESTIONS = [
  [
    "Quando você recebe seu dinheiro (mesada, salário ou bolsa), o que você costuma fazer?",
    [
      "Guardo uma parte antes de gastar qualquer coisa",
      "Gasto a maior parte rapidamente",
      "Separo para investir",
      "Uso metade para gastos e metade guardo",
    ],
  ],
  [
    "Como você decide o que comprar?",
    [
      "Pesquiso preços e penso antes",
      "Compro por impulso, se eu quero eu levo",
      "Avalio se é investimento ou gasto",
      "Pondero, mas às vezes compro por impulso",
    ],
  ],
  [
    "Se você tivesse R$ 500 hoje, o que faria?",
    [
      "Guardaria na poupança",
      "Compraria algo que quero há tempo",
      "Investiria",
      "Guardaria metade e gastaria metade",
    ],
  ],
  [
    "Você costuma anotar seus gastos?",
    [
      "Sim, sempre",
      "Nunca",
      "Sim, e acompanho investimentos também",
      "Às vezes, mas não consigo manter",
    ],
  ],
  [
    "Como você se sente sobre dinheiro?",
    [
      "Seguro, tenho controle",
      "Ansioso, sempre falta",
      "Confiante, faço render",
      "Normal, mas poderia melhorar",
    ],
  ],
];
const PROFILES = {
  A: {
    title: "Perfil: Poupador 🌱",
    description:
      "Você tem uma base sólida de controle financeiro. Sua tendência natural é guardar e planejar antes de gastar.",
    message:
      "Você tem uma base sólida. O próximo passo é fazer seu dinheiro render.",
    recommendations: [
      "Investimentos para Iniciantes",
      "Independência Financeira",
    ],
  },
  B: {
    title: "Perfil: Consumidor Impulsivo 🔥",
    description:
      "Você tende a gastar por impulso e sem planejamento. Não se preocupe — é exatamente por isso que este portal existe!",
    message: "Você gasta por impulso. Aprenda a planejar antes de comprar.",
    recommendations: ["Orçamento", "Consumo Consciente"],
  },
  C: {
    title: "Perfil: Investidor Iniciante 📈",
    description:
      "Você já tem noções de investimento e busca fazer o dinheiro render. Tem potencial para evoluir muito!",
    message:
      "Você já tem noções de investimento. Evolua para estratégias mais avançadas.",
    recommendations: ["Investimentos para Iniciantes", "Planejamento"],
  },
  D: {
    title: "Perfil: Equilibrado ⚖️",
    description:
      "Você alterna entre guardar e gastar. Com mais conhecimento, pode transformar esse equilíbrio em estratégia.",
    message:
      "Você alterna entre guardar e gastar. Transforme esse equilíbrio em estratégia.",
    recommendations: ["Orçamento", "Investimentos para Iniciantes"],
  },
};
function readAnswers() {
  try {
    return JSON.parse(sessionStorage.getItem("mffAnswers") || "{}");
  } catch {
    return {};
  }
}
export default function BehavioralTest({
  onLogin,
  onDashboard,
  autoSubmit = 0,
}) {
  const { user, saveTest, getTest } = useAuth();
  const [answers, setAnswers] = useState(readAnswers);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    if (user && !result) {
      getTest().then(({ data }) => {
        if (data && data.profile) {
          const key = data.answers?.key || "A";
          setResult({ winner: key, ...PROFILES[key] });
        }
      }).catch(() => { });
    }
  }, [user]);
  const submit = async (event) => {
    event?.preventDefault();
    if (!user) {
      setFeedback(
        "Faça login para ver seu resultado e receber recomendações personalizadas.",
      );
      onLogin("teste");
      return;
    }
    const values = QUESTIONS.map((_, index) => answers[index]);
    if (values.some((answer) => !answer)) {
      setFeedback("Responda às 5 perguntas para ver seu resultado.");
      return;
    }
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    values.forEach((answer) => {
      counts[answer] += 1;
    });
    const winner = values.find(
      (answer) => counts[answer] === Math.max(...Object.values(counts)),
    );
    const profile = PROFILES[winner];
    setResult({ winner, ...profile });
    setFeedback("");
    try {
      await saveTest(
        profile.title.replace(/^Perfil: /, "").replace(/ [🌱🔥📈⚖️].*$/, ""),
        { ...answers, key: winner, scores: counts },
      );
    } catch {
      setFeedback("Resultado exibido, mas não foi possível salvá-lo agora.");
    }
  };
  useEffect(() => {
    if (user && autoSubmit) submit();
  }, [user, autoSubmit]);
  return (
    <section className="behavior">
      <div className="container">
        <div className="behavior-intro">
          <p className="eyebrow">Autoconhecimento</p>
          <h2>Teste Comportamental</h2>
          <p>
            Descubra como seus hábitos influenciam suas decisões financeiras.
            Escolha uma opção por pergunta para receber uma leitura do seu
            perfil.
          </p>
          <p className="behavior-explainer">
            Descubra seu perfil financeiro e receba trilhas de aprendizagem
            personalizadas.
          </p>
        </div>
        <form className="behavior-form" onSubmit={submit}>
          {QUESTIONS.map(([question, options], index) => (
            <fieldset className="behavior-question" key={question}>
              <legend>
                {index + 1}. {question}
              </legend>
              <div className="behavior-options">
                {options.map((option, choice) => {
                  const value = String.fromCharCode(65 + choice);
                  return (
                    <label
                      className={`behavior-option ${answers[index] === value ? "selected" : ""}`}
                      key={option}
                    >
                      <input
                        type="radio"
                        name={`pergunta${index + 1}`}
                        value={value}
                        checked={answers[index] === value}
                        onChange={(event) => {
                          const next = {
                            ...answers,
                            [index]: event.target.value,
                          };
                          setAnswers(next);
                          sessionStorage.setItem(
                            "mffAnswers",
                            JSON.stringify(next),
                          );
                        }}
                        required
                      />{" "}
                      {value}) {option}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <div className="behavior-actions">
            <button className="btn btn-primary" type="submit">
              Ver resultado <span aria-hidden="true">→</span>
            </button>
            <p className="behavior-feedback" role="alert" aria-live="polite">
              {feedback}
            </p>
          </div>
        </form>
        {result && (
          <article className="behavior-result card" role="status" tabIndex="-1">
            <p className="result-kicker">Seu resultado</p>
            <h3>{result.title}</h3>
            <p>{result.description}</p>
            <p className="recommendation-message">{result.message}</p>
            <ul className="recommendations">
              {result.recommendations.map((item) => (
                <li key={item}>
                  <button
                    className="btn-quiet"
                    type="button"
                    onClick={onDashboard}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary" onClick={onDashboard}>
              Ver minhas trilhas recomendadas →
            </button>
          </article>
        )}
      </div>
    </section>
  );
}
