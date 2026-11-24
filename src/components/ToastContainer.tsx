import React from 'react';
import { useMovies } from '../context/MovieContext';
import { ToastType } from '../types/movie';

const styleByType: Record<ToastType, string> = {
  success: 'border-emerald-600 bg-emerald-900 text-white',
  info: 'border-teal-600 bg-slate-900 text-white',
  warning: 'border-amber-500 bg-amber-950 text-amber-50',
  error: 'border-rose-600 bg-rose-950 text-rose-50',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMovies();
  if (toasts.length === 0) return null;

  return (
    <div aria-live="polite" aria-atomic="true" className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2.5">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`flex items-center justify-between gap-3 rounded-xl border-l-4 px-4 py-3 text-sm font-medium shadow-lg ${styleByType[toast.type]}`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            aria-label="Đóng thông báo"
            className="rounded-lg p-1 text-white/80 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
