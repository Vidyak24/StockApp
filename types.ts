export interface Stock {
  id: string;
  symbol: string;
  name: string;
  addedAt: string;
  newsSummary: string;
  sources: Source[];
}

export interface Source {
  title: string;
  uri: string;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}
