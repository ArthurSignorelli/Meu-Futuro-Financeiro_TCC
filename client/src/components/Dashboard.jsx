import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import LearningTrails from "./LearningTrails";
import ResourceLibrary from "./ResourceLibrary";
import BudgetCalculator from "./BudgetCalculator";
export default function Dashboard({ onHome, onLogout, onLogin }) {
  const { user } = useAuth();
  const [calculator, setCalculator] = useState(false);
  const [mobile, setMobile] = useState(false);
  const navigate = (id) => {
    setCalculator(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobile(false);
  };
  return (
    <div className={`dashboard-layout ${mobile ? "menu-open" : ""}`}>
      <Sidebar onNavigate={navigate} />
      <div className="mobile-menu-overlay" onClick={() => setMobile(false)} />
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobile(!mobile)}
            aria-label={mobile ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobile}
          >
            ☰
          </button>
          <div className="breadcrumb">
            <span>Portal</span>
            <span aria-hidden="true">›</span>
            <strong>Dashboard</strong>
          </div>
          <div className="top-user">
            <span>{user?.name}</span>
            <span className="avatar" aria-hidden="true">
              {user?.name?.[0]}
            </span>
            <button className="btn btn-quiet" onClick={onLogout}>
              Sair
            </button>
          </div>
        </header>
        <div className="dashboard-content" id="top">
          <div className="dashboard-heading">
            <div>
              <p className="eyebrow">Área do estudante</p>
              <h1>Sua jornada financeira</h1>
              <p>Acompanhe o que já aprendeu e encontre o próximo passo.</p>
            </div>
            <button className="btn btn-secondary" onClick={onHome}>
              ← Voltar ao portal
            </button>
          </div>
          <section className="welcome-card card">
            <div>
              <h2>Olá, {user?.name}! Continue sua jornada</h2>
              <p>
                Você está construindo uma base importante para tomar decisões
                com mais autonomia. Que tal continuar de onde parou?
              </p>
            </div>
            <div className="welcome-stat">
              <strong>68%</strong>
              <span>progresso geral</span>
            </div>
          </section>
          <section id="trilhas-dashboard" className="dashboard-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Acompanhe sua evolução</p>
                <h2>Progresso das trilhas</h2>
              </div>
              <p>3 trilhas em andamento</p>
            </div>
            <LearningTrails progressOnly />
          </section>
          {calculator ? (
            <BudgetCalculator
              onBack={() => setCalculator(false)}
              onLogin={onLogin}
            />
          ) : (
            <ResourceLibrary onCalculator={() => setCalculator(true)} />
          )}
          <footer className="dashboard-footer">
            Meu Futuro Financeiro · Projeto TCC IFSP · 2026{" "}
            <button className="btn-quiet" onClick={onLogout}>
              Sair
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
