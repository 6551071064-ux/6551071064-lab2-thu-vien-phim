export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  genre: string;
  director: string;
  cast: string[];
  durationMinutes: number;
  rating: number;
  rentalPrice: number;
  posterColor: string;
  posterUrl?: string;
  curatorEmail: string;
  synopsis: string;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}
