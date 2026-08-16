export type HealthStatus = "Healthy" | "Warning" | "Diseased" | "Unknown";

export interface PlantAnalysis {
  plantName: string;
  scientificName: string;
  confidence: number;
  tags: string[];
  healthStatus: HealthStatus;
  problem: string;
  noticed: string;
  description: string;
  recommendations: string[];
  care: {
    sunlight: string;
    water: string;
    soil: string;
    temperature: string;
  };
  demo?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ScanRecord {
  image: string;
  analysis: PlantAnalysis;
  messages: ChatMessage[];
  createdAt: number;
}

const KEY = "plantai:last-scan";

export function saveScan(scan: ScanRecord) {
  try {
    localStorage.setItem(KEY, JSON.stringify(scan));
  } catch {
    /* storage full or unavailable */
  }
}

export function loadScan(): ScanRecord | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ScanRecord) : null;
  } catch {
    return null;
  }
}

export function clearScan() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
