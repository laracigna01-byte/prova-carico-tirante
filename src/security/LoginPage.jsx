import { useState } from "react";
import { login } from "./auth";

export function LoginPage({ appName, moduleName, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err.message || "Credenziali non valide");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dismat-login-page">
      <section className="dismat-login-card">
        <img
          src="/logo-dismat.jpeg"
          alt="DISMAT"
          className="dismat-login-logo"
        />

        <h1>{appName}</h1>

        {moduleName && (
          <h2 className="dismat-module-title">{moduleName}</h2>
        )}

        <h3 className="dismat-login-subtitle">
          Area riservata ai tecnici autorizzati
        </h3>

        <p className="dismat-login-text">
          Inserire le credenziali fornite da DISMAT per accedere all'applicazione.
        </p>

        <button
          type="button"
          className="dismat-instructions-toggle"
          onClick={() => setShowInstructions((prev) => !prev)}
        >
          📘 {showInstructions ? "Nascondi istruzioni" : "Istruzioni per l'uso"}
        </button>

        {showInstructions && (
          <div className="dismat-instructions-box">
            <h4>Accesso all'applicazione</h4>
            <p>
              Le credenziali di accesso, nome utente e password, sono riservate
              esclusivamente al personale autorizzato.
            </p>
            <p>
              Per ottenere le credenziali o richiederne il ripristino,
              contattare <b>Arch. Giuseppe Castellano</b>, Laboratorio DISMAT.
            </p>

            <h4>Uso dell'app prova su tirante</h4>
            <p>
              Compilare i dati generali della prova, i dati del tirante, il
              carico di esercizio, il carico di collaudo e le informazioni del
              martinetto.
            </p>
            <p>
              Inserire le letture del comparatore per ciascun gradino di carico.
              L'app calcola gli spostamenti, genera il grafico carico/spostamento
              e consente di riportare foto, firma ed esito della prova nel PDF.
            </p>
            <p>
              Prima di generare la minuta, verificare eventuali avvisi nella
              schermata principale e salvare la prova in archivio quando
              necessario.
            </p>

            <h4>Sviluppo software</h4>
            <p>
              Applicazione sviluppata per il Laboratorio DISMAT da{" "}
              <b>Lara Maria Cigna</b>.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="dismat-login-form">
          <label>
            Utente
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <label className="dismat-show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Mostra password
          </label>

          {error && <div className="dismat-login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <footer>
          Versione 3.1<br />
          © DISMAT S.r.l.
        </footer>
      </section>
    </main>
  );
}