const AUTH_KEY = "dismat_auth";
const AUTH_TIME_KEY = "dismat_auth_time";
const SESSION_DURATION_HOURS = 12;

export function isAuthenticated() {
  const auth = sessionStorage.getItem(AUTH_KEY);
  const time = sessionStorage.getItem(AUTH_TIME_KEY);

  if (auth !== "true" || !time) return false;

  const elapsedHours = (Date.now() - Number(time)) / (1000 * 60 * 60);

  if (elapsedHours > SESSION_DURATION_HOURS) {
    logout();
    return false;
  }

  return true;
}

export async function login(username, password) {
  const isLocalhost = window.location.hostname === "localhost";

  if (isLocalhost) {
    if (username === "demo" && password === "demo2026") {
      sessionStorage.setItem(AUTH_KEY, "true");
      sessionStorage.setItem(AUTH_TIME_KEY, String(Date.now()));
      return true;
    }

    throw new Error("Credenziali non valide");
  }

  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Credenziali non valide");
  }

  sessionStorage.setItem(AUTH_KEY, "true");
  sessionStorage.setItem(AUTH_TIME_KEY, String(Date.now()));

  return true;
}
export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_TIME_KEY);
}