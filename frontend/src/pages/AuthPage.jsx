import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/authService";

const baseRegisterState = {
  name: "",
  phoneNumber: "",
  password: "",
};

const baseLoginState = {
  phoneNumber: "",
  password: "",
};

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("mode") === "register" ? "register" : "login");
  const [loginValues, setLoginValues] = useState(baseLoginState);
  const [registerValues, setRegisterValues] = useState(baseRegisterState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/assistant";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : redirectTo, { replace: true });
    }
  }, [isAdmin, isAuthenticated, navigate, redirectTo]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setSearchParams(nextMode === "register" ? { mode: "register" } : {});
    setError("");
  };

  const finishLogin = async (phoneNumber, password) => {
    const session = await loginUser({ phoneNumber, password });
    login({
      accessToken: session.access_token,
      admin: session.is_admin,
      phone: phoneNumber,
    });
    navigate(session.is_admin ? "/admin" : redirectTo, { replace: true });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await finishLogin(loginValues.phoneNumber, loginValues.password);
    } catch (submissionError) {
      setError(submissionError?.response?.data?.detail || "Unable to sign in. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await registerUser({
        name: registerValues.name,
        phone_number: registerValues.phoneNumber,
        password: registerValues.password,
      });

      await finishLogin(registerValues.phoneNumber, registerValues.password);
    } catch (submissionError) {
      setError(submissionError?.response?.data?.detail || "Unable to create the account right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="surface-card hero-glow rounded-[2.4rem] p-8"
      >
        <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Access your AI workspace</div>
        <h1 className="font-display mt-4 text-5xl leading-tight text-slate-950">Sign in to unlock live assistant responses.</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
          Authentication enables JWT-protected triage requests, saved inquiry history, and role-based admin tools.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.8rem] bg-white/85 p-5">
            <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Customers</div>
            <div className="mt-2 text-sm leading-7 text-slate-700">Get AI answers and view inquiry history.</div>
          </div>
          <div className="rounded-[1.8rem] bg-white/85 p-5">
            <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">Admin</div>
            <div className="mt-2 text-sm leading-7 text-slate-700">Manage inquiries, status, and property uploads.</div>
          </div>
          <div className="rounded-[1.8rem] bg-white/85 p-5">
            <div className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">AI layer</div>
            <div className="mt-2 text-sm leading-7 text-slate-700">Use the protected `/triage` flow with live listings.</div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.06, ease: "easeOut" }}
        className="surface-card-strong rounded-[2.4rem] p-8"
      >
        <div className="flex gap-3 rounded-full bg-slate-900/5 p-2">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-bold transition ${
              mode === "login" ? "bg-slate-950 text-white" : "text-slate-600"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-bold transition ${
              mode === "register" ? "bg-slate-950 text-white" : "text-slate-600"
            }`}
          >
            Create account
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>
        ) : null}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              className="input-shell"
              type="text"
              placeholder="Phone number"
              value={loginValues.phoneNumber}
              onChange={(event) => setLoginValues((current) => ({ ...current, phoneNumber: event.target.value }))}
              required
            />
            <input
              className="input-shell"
              type="password"
              placeholder="Password"
              value={loginValues.password}
              onChange={(event) => setLoginValues((current) => ({ ...current, password: event.target.value }))}
              required
            />
            <button type="submit" disabled={isSubmitting} className="pill-button w-full bg-slate-950 text-white">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <input
              className="input-shell"
              type="text"
              placeholder="Full name"
              value={registerValues.name}
              onChange={(event) => setRegisterValues((current) => ({ ...current, name: event.target.value }))}
              required
            />
            <input
              className="input-shell"
              type="text"
              placeholder="10-digit phone number"
              value={registerValues.phoneNumber}
              onChange={(event) => setRegisterValues((current) => ({ ...current, phoneNumber: event.target.value }))}
              required
            />
            <input
              className="input-shell"
              type="password"
              placeholder="Create password"
              value={registerValues.password}
              onChange={(event) => setRegisterValues((current) => ({ ...current, password: event.target.value }))}
              required
            />
            <button type="submit" disabled={isSubmitting} className="pill-button w-full bg-slate-950 text-white">
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-5 text-sm leading-7 text-slate-600">
          Admin access is controlled by the backend. Standard customer registration creates a non-admin account.
        </p>
      </motion.section>
    </div>
  );
}
