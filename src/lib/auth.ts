const KEY = "plantai:user";

export interface DemoUser {
  name: string;
  email?: string;
  guest?: boolean;
}

export function getUser(): DemoUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

export function setUser(user: DemoUser) {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
