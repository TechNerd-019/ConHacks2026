export type PlantStatus = "Excellent" | "Good" | "Needs Water" | "Critical";

export interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  imageUrl: string;
  vitality: number; // 0-100
  status: PlantStatus;
  metrics: {
    temp?: number;
    moisture?: number;
    reservoir?: number;
    light?: number;
    humidity?: number;
    ph?: number;
    co2?: number;
  };
  description: string;
  isFavorite?: boolean;
}

export type View = "garden" | "analytics" | "add" | "assistant" | "detail" | "history";

export interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  timestamp: Date;
}
