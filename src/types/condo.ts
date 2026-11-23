export interface CondoItem {
  id: number;
  name: string;
  station: string;
  transitType?: string;
  distance: string;
  price?: number;
  price_per_month?: number;
  petFriendly?: boolean;
  pet_friendly?: boolean;
  lifestyle?: string[];
  lifestyle_tags?: string[];
  desc?: string;
  description?: string;
  image: string;
  match_score?: number;
  match_reasons?: string[];
}

export interface ConditionItem {
  id: "entityTransit" | "entityPet" | "entityLifestyle" | "entityBudget";
  value: string;
  active: boolean;
}

export interface ConditionSummary {
  items: ConditionItem[];
  badge: string;
}

export interface ExtractedEntities {
  station?: string | null;
  line?: string | null;
  out_of_scope?: string | null;
  pet_friendly?: boolean | null;
  min_price?: number | null;
  max_price?: number | null;
  lifestyle_tags_matched?: string[];
}

export interface SearchResponse {
  query: string;
  entities: ExtractedEntities;
  condition_summary?: ConditionSummary;
  total_found: number;
  results: CondoItem[];
}

export interface CondosListResponse {
  total: number;
  condos: CondoItem[];
  recommended: CondoItem[];
  condition_summary?: ConditionSummary;
}
