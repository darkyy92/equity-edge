export interface SavedAnalysis {
  id: string;
  user_id: string;
  symbol: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedAnalysisInsert {
  id?: string;
  user_id: string;
  symbol: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SavedAnalysisUpdate {
  id?: string;
  user_id?: string;
  symbol?: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}