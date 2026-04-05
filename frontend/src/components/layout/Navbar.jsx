import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "AI Assistant", to: "/assistant" },
];

const getNavItemClass = ({ isActive }) =>
  [
    "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150",
    isActive
      ? "bg-slate-950 shadow-sm ring-1 ring-slate-950/90"
      : "text-slate-700 hover:bg-white/65 hover:text-slate-950",
  ].join(" ");

const getNavItemStyle = ({ isActive }) => ({
  color: isActive ? "#ffffff" : undefined,
});

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { openChat } = useChat();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.header
      className="sticky top-0 z-40 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="surface-card-strong rounded-[1.75rem] px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-extrabold uppercase tracking-[0.28em] text-white">
                HA
              </div>
              <div>
                <div className="font-display text-2xl text-slate-950">Haven AI</div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Real estate concierge
                </div>
              </div>
            </NavLink>
            <button
              type="button"
              onClick={openChat}
              className="pill-button bg-slate-950 px-4 py-3 text-sm text-white lg:hidden"
            >
              Open AI
            </button>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={getNavItemClass}
                  style={getNavItemStyle}
                >
                  {item.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <NavLink
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className={getNavItemClass}
                  style={getNavItemStyle}
                >
                  {isAdmin ? "Admin" : "Dashboard"}
                </NavLink>
              ) : null}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openChat}
                className="pill-button hidden bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/10 lg:inline-flex"
              >
                AI Chat
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="pill-button bg-slate-950 text-white"
                >
                  Log out
                </button>
              ) : (
                <NavLink to="/auth" className="pill-button bg-slate-950 text-white">
                  Sign in
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
