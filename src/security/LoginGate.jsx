import { useState } from "react";
import { isAuthenticated, logout } from "./auth";
import { LoginPage } from "./LoginPage";
import "./loginGate.css";

export function LoginGate({ children, appName = "Sistema Gestione Prove DISMAT" }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  function handleLogout() {
    logout();
    setAuthenticated(false);
  }

  if (!authenticated) {
    return (
      <LoginPage
        appName={appName}
        onSuccess={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <>
      <div className="dismat-auth-bar">
        <span>Accesso autorizzato</span>
        <button type="button" onClick={handleLogout}>
          Esci
        </button>
      </div>

      {children}
    </>
  );
}