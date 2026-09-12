import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
export default function App() {
  const { user, loading, logout } = useAuth();
  const [page, setPage] = useState("home");
  const [register, setRegister] = useState(false);
  const [pending, setPending] = useState("");
  const [autoSubmit, setAutoSubmit] = useState(0);
  useEffect(() => {
    if (user && page === "login") {
      if (pending === "teste") {
        setPage("home");
        setAutoSubmit((value) => value + 1);
      } else if (pending === "orcamento") setPage("dashboard");
      else setPage("dashboard");
      setPending("");
    }
  }, [user, page, pending]);
  if (loading)
    return (
      <div className="loading-state" aria-live="polite">
        Carregando portal…
      </div>
    );
  const login = (action = "") => {
    setPending(action);
    setRegister(false);
    setPage("login");
  };
  const registerPage = () => {
    setRegister(true);
    setPending("");
    setPage("login");
  };
  const onLogout = () => {
    logout();
    setPage("home");
  };
  if (page === "login" && !user)
    return (
      <Login
        register={register}
        onSwitch={setRegister}
        onBack={() => setPage("home")}
        onSuccess={() => {}}
      />
    );
  if (page === "dashboard" && user)
    return (
      <Dashboard
        onHome={() => setPage("home")}
        onLogout={onLogout}
        onLogin={login}
      />
    );
  return (
    <Home
      user={user}
      onLogin={login}
      onRegister={registerPage}
      onLogout={onLogout}
      onDashboard={() => (user ? setPage("dashboard") : login("teste"))}
      autoSubmit={autoSubmit}
    />
  );
}
