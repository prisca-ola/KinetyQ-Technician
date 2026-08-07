import { loadJSON, saveJSON, STORAGE_KEYS } from "./storage";

export type QuoteStatus = "pending" | "accepted" | "rejected";

// One submitted estimate/quote. Individual and business fields both live here;
// `path` says which set is meaningful. Read by My Jobs (Quoted tab) later.
export interface QuoteRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  vehicle: string;
  path: "individual" | "business";
  ts: number;
  status: QuoteStatus;
  note?: string;
  // individual
  minCost?: number;
  maxCost?: number;
  estTime?: string;
  confidence?: string;
  // business
  labor?: number;
  parts?: number;
  other?: number;
  total?: number;
  timeline?: string;
  assignee?: string;
}

export function getQuotes(): QuoteRecord[] {
  return loadJSON<QuoteRecord[]>(STORAGE_KEYS.quotes, []);
}

export function addQuote(q: QuoteRecord): void {
  saveJSON(STORAGE_KEYS.quotes, [q, ...getQuotes()]);
}

export function newQuoteId(): string {
  return "q-" + Date.now().toString(36);
}
