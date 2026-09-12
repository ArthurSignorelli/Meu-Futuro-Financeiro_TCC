export default function Header({ user, onLogin, onRegister, onLogout }) {
  return <header className="home-header"><div className="container header-inner">
    <a className="brand" href="#main-content" aria-label="Meu Futuro Financeiro, início"><span className="brand-mark" aria-hidden="true">↗</span><span>Meu Futuro Financeiro</span></a>
    <nav className="home-nav" aria-label="Navegação principal"><a href="#sobre">Sobre o projeto</a></nav>
    {!user ? <div className="header-actions"><button className="btn btn-secondary" onClick={onLogin}>Entrar</button><button className="btn btn-primary" onClick={onRegister}>Criar conta</button></div> : <div className="header-actions header-user-info"><span className="top-user">{user.name}<span className="avatar" aria-hidden="true">{user.name[0]}</span></span><button className="btn btn-quiet" onClick={onLogout}>Sair</button></div>}
  </div></header>;
}
