import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  totalMovies: number;
  onOpenCreate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ totalMovies, onOpenCreate }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-extrabold text-white shadow-sm">
            CE
          </span>
          <div>
            <span className="block text-lg font-bold tracking-tight text-slate-900">CineEmerald</span>
            <span className="block text-xs font-medium text-emerald-800">Nguyễn Thanh Phong · 6551071064</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-900 sm:inline-block">
            Kho phim: {totalMovies} tác phẩm
          </span>
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Thêm phim mới
          </button>
        </div>
      </div>
    </header>
  );
};
