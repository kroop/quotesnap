import type { Quote, SavedClient } from "./types";

const DRAFT_KEY = "quotesnap_draft";
const CLIENTS_KEY = "quotesnap_clients";
const HISTORY_KEY = "quotesnap_history";
const BUSINESS_KEY = "quotesnap_business";

export function saveDraft(quote: Quote) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(quote));
}

export function loadDraft(): Quote | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Quote) : null;
  } catch {
    return null;
  }
}

export function saveBusinessProfile(from: Quote["from"]) {
  localStorage.setItem(BUSINESS_KEY, JSON.stringify(from));
}

export function loadBusinessProfile(): Quote["from"] | null {
  try {
    const raw = localStorage.getItem(BUSINESS_KEY);
    return raw ? (JSON.parse(raw) as Quote["from"]) : null;
  } catch {
    return null;
  }
}

export function getClients(): SavedClient[] {
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    return raw ? (JSON.parse(raw) as SavedClient[]) : [];
  } catch {
    return [];
  }
}

export function saveClient(client: SavedClient) {
  const clients = getClients().filter((c) => c.id !== client.id);
  clients.unshift(client);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients.slice(0, 100)));
}

export function getHistory(): Quote[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as Quote[]) : [];
  } catch {
    return [];
  }
}

export function pushHistory(quote: Quote) {
  const history = getHistory().filter((h) => h.id !== quote.id);
  history.unshift({ ...quote, id: crypto.randomUUID() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 200)));
}
