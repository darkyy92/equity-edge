export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface WatchlistInsert {
  id?: string;
  user_id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface WatchlistUpdate {
  id?: string;
  user_id?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WatchlistStock {
  id: string;
  watchlist_id: string;
  symbol: string;
  added_at: string;
}

export interface WatchlistStockInsert {
  id?: string;
  watchlist_id: string;
  symbol: string;
  added_at?: string;
}

export interface WatchlistStockUpdate {
  id?: string;
  watchlist_id?: string;
  symbol?: string;
  added_at?: string;
}