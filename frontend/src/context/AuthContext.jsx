import { createContext, useContext, useState } from "react";

const TOKEN_KEY = "real-estate-ai-token";
const ADMIN_KEY = "real-estate-ai-admin";
const PHONE_KEY = "real-estate-ai-phone";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem(ADMIN_KEY) === "true");
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem(PHONE_KEY) || "");

  const login = ({ accessToken, admin = false, phone = "" }) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(ADMIN_KEY, String(admin));
    localStorage.setItem(PHONE_KEY, phone);
    setToken(accessToken);
    setIsAdmin(Boolean(admin));
    setPhoneNumber(phone);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(PHONE_KEY);
    setToken("");
    setIsAdmin(false);
    setPhoneNumber("");
  };

  const value = {
    token,
    isAuthenticated: Boolean(token),
    isAdmin,
    phoneNumber,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
