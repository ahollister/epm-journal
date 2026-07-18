export interface Characteristic {
  id: string;
  name: string;
  order: number;
  score?: number;
}

export interface ThreeLists {
  who: string[];
  why: Record<string, string[]>;
  improvements: string[];
}

export interface Baseline {
  version: 1;
  characteristics: Characteristic[];
  focusAreas: string[];
  createdAt: string;
  userId: string;
}
