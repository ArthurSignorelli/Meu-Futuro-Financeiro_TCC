import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const Context = createContext(null);
const message = (error) =>
  error.response?.data?.error || "Não foi possível concluir a operação.";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("mffToken");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("mffToken"))
      .finally(() => setLoading(false));
  }, []);
  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        try {
          const { data } = await api.post("/auth/login", { email, password });
          localStorage.setItem("mffToken", data.token);
          setUser(data.user);
          return { ok: true };
        } catch (error) {
          return { ok: false, message: message(error) };
        }
      },
      async register(name, email, password) {
        try {
          const { data } = await api.post("/auth/register", {
            name,
            email,
            password,
          });
          localStorage.setItem("mffToken", data.token);
          setUser(data.user);
          return { ok: true };
        } catch (error) {
          return { ok: false, message: message(error) };
        }
      },
      logout() {
        localStorage.removeItem("mffToken");
        setUser(null);
      },
      async saveTest(profile, answers) {
        return api.post("/test", { profile, answers });
      },
      async getTest() {
        return api.get("/test");
      },
      async saveBudget(data) {
        return api.post("/budget", data);
      },
      async getBudgets() {
        return api.get("/budget");
      },
    }),
    [user, loading],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
