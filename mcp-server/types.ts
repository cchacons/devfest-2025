export interface SwapiSearchResponse {
  results: any[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface SwapiError {
  error: string;
}
