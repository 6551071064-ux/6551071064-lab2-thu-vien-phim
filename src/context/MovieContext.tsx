import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import initialMoviesData from '../data/data.json';
import { Movie, ToastItem, ToastType } from '../types/movie';

const STORAGE_KEY = '6551071064_movies_library_v1';

interface State {
  movies: Movie[];
  toasts: ToastItem[];
}

type Action =
  | { type: 'ADD_MOVIE'; payload: Movie }
  | { type: 'UPDATE_MOVIE'; payload: Movie }
  | { type: 'DELETE_MOVIE'; payload: string }
  | { type: 'REORDER_MOVIES'; payload: Movie[] }
  | { type: 'RESET_MOVIES'; payload: Movie[] }
  | { type: 'ADD_TOAST'; payload: ToastItem }
  | { type: 'REMOVE_TOAST'; payload: string };

function loadInitialMovies(): Movie[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Movie[];
      }
    }
  } catch {
    // Fallback
  }
  return initialMoviesData as Movie[];
}

function movieReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_MOVIE':
      return { ...state, movies: [action.payload, ...state.movies] };
    case 'UPDATE_MOVIE':
      return { ...state, movies: state.movies.map((m) => (m.id === action.payload.id ? action.payload : m)) };
    case 'DELETE_MOVIE':
      return { ...state, movies: state.movies.filter((m) => m.id !== action.payload) };
    case 'REORDER_MOVIES':
      return { ...state, movies: action.payload };
    case 'RESET_MOVIES':
      return { ...state, movies: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

interface MovieContextValue {
  movies: Movie[];
  toasts: ToastItem[];
  addMovie: (movie: Omit<Movie, 'id'>) => void;
  updateMovie: (movie: Movie) => void;
  deleteMovie: (id: string) => void;
  reorderMovies: (newOrder: Movie[]) => void;
  resetMovies: () => void;
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const MovieContext = createContext<MovieContextValue | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, undefined, () => ({
    movies: loadInitialMovies(),
    toasts: [],
  }));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.movies));
    } catch {
      // Ignore
    }
  }, [state.movies]);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
      setTimeout(() => removeToast(id), 3500);
    },
    [removeToast],
  );

  const addMovie = useCallback(
    (movieData: Omit<Movie, 'id'>) => {
      const newMovie: Movie = { ...movieData, id: `mv-${Date.now()}` };
      dispatch({ type: 'ADD_MOVIE', payload: newMovie });
      showToast(`Đã thêm phim "${newMovie.title}" vào thư viện!`, 'success');
    },
    [showToast],
  );

  const updateMovie = useCallback(
    (movie: Movie) => {
      dispatch({ type: 'UPDATE_MOVIE', payload: movie });
      showToast(`Đã cập nhật thông tin phim "${movie.title}"!`, 'info');
    },
    [showToast],
  );

  const deleteMovie = useCallback(
    (id: string) => {
      const target = state.movies.find((m) => m.id === id);
      dispatch({ type: 'DELETE_MOVIE', payload: id });
      showToast(`Đã xóa phim "${target?.title ?? ''}" khỏi thư viện.`, 'warning');
    },
    [state.movies, showToast],
  );

  const reorderMovies = useCallback(
    (newOrder: Movie[]) => {
      dispatch({ type: 'REORDER_MOVIES', payload: newOrder });
      showToast('Đã cập nhật thứ tự sắp xếp danh sách phim!', 'info');
    },
    [showToast],
  );

  const resetMovies = useCallback(() => {
    dispatch({ type: 'RESET_MOVIES', payload: initialMoviesData as Movie[] });
    showToast('Đã khôi phục 20 bộ phim mặc định ban đầu.', 'success');
  }, [showToast]);

  return (
    <MovieContext.Provider
      value={{ movies: state.movies, toasts: state.toasts, addMovie, updateMovie, deleteMovie, reorderMovies, resetMovies, showToast, removeToast }}
    >
      {children}
    </MovieContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useMovies(): MovieContextValue {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovies phải được sử dụng bên trong MovieProvider');
  return ctx;
}
