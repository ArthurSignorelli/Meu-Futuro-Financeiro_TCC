import BehavioralTest from "./BehavioralTest";
import LearningTrails from "./LearningTrails";
import Header from "./Header";
export default function Home({
  user,
  onLogin,
  onRegister,
  onLogout,
  onDashboard,
  autoSubmit = 0,
}) {
  return (
    <section className="page is-active" aria-labelledby="home-title">
      <Header
        user={user}
        onLogin={() => onLogin("")}
        onRegister={onRegister}
        onLogout={onLogout}
      />
      <main id="main-content">
        <section className="hero">
          <div className="container hero-content">
            <p className="eyebrow light">Um passo de cada vez</p>
            <h1 id="home-title">
              Portal de Educação Financeira <strong>para Jovens</strong>
            </h1>
            <p>
              Aprenda a tomar decisões com mais clareza, organize seus planos e
              construa uma relação mais consciente com o dinheiro.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={onRegister}>
                Começar agora <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>
        <section id="sobre" className="about">
          <div className="container about-grid">
            <div>
              <p className="eyebrow">Sobre o projeto</p>
              <h2>Conhecimento para escolher o próximo passo</h2>
              <p>
                O Meu Futuro Financeiro é um projeto de educação financeira
                desenvolvido para aproximar jovens de conceitos que fazem parte
                da vida real. Em uma experiência simples e progressiva, o portal
                reúne conteúdos, ferramentas e reflexões para apoiar decisões
                mais responsáveis — sem transformar finanças em um assunto
                complicado.
              </p>
            </div>
            <aside className="about-note card">
              <span className="icon-box" aria-hidden="true">
                ✦
              </span>
              <h3>Aprender fazendo</h3>
              <p>
                Use as trilhas para estudar, pratique com os recursos e
                acompanhe a sua evolução no seu ritmo.
              </p>
              <span className="mini-line">
                Conteúdo claro, escolhas conscientes
              </span>
            </aside>
          </div>
        </section>
        <BehavioralTest
          onLogin={onLogin}
          onDashboard={onDashboard}
          autoSubmit={autoSubmit}
        />
        {!user && (
          <section className="benefits">
            <div className="container">
              <div className="benefits-card card">
                <p className="eyebrow">Acesse o portal</p>
                <h2>Com seu login você tem acesso a:</h2>
                <ul className="benefits-list">
                  <li>
                    <span className="icon-box">✓</span>
                    <span>
                      Resultado do teste comportamental com recomendações
                      personalizadas
                    </span>
                  </li>
                  <li>
                    <span className="icon-box">✓</span>
                    <span>Trilhas de dicas de educação financeira</span>
                  </li>
                  <li>
                    <span className="icon-box">✓</span>
                    <span>Planilha interativa de gastos e orçamento</span>
                  </li>
                </ul>
                <button className="btn btn-primary" onClick={onRegister}>
                  Criar conta gratuita <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </section>
        )}
        <footer className="site-footer">
          <div className="container">
            <small>© 2026 Meu Futuro Financeiro · Projeto TCC IFSP</small>
          </div>
        </footer>
      </main>
    </section>
  );
}
