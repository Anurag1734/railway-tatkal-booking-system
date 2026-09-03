const TOKEN_KEY = "railway_tatkal_token";
const USER_ID_KEY = "railway_tatkal_user_id";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredSession(token: string, userId: number): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, String(userId));
}

export function clearStoredSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function getStoredUserId(): number | null {
  const value = localStorage.getItem(USER_ID_KEY);
  return value ? Number(value) : null;
}
