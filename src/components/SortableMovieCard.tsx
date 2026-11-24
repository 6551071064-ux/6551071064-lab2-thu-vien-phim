import React from 'react';
import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Movie } from '../types/movie';
import { formatCurrency, truncateText } from '../utils';
import { PosterImage } from './PosterImage';

interface SortableMovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
}

export const SortableMovieCard: React.FC<SortableMovieCardProps> = ({ movie, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: movie.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
    zIndex: isDragging ? 20 : 'auto',
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-400 hover:shadow-md"
    >
      <div className="relative overflow-hidden bg-emerald-950">
        <Link to={`/item/${movie.id}`} className="block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-400">
          <PosterImage movie={movie} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
        </Link>
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Kéo thả để sắp xếp phim ${movie.title}`}
          title="Kéo thả để thay đổi vị trí"
          className="absolute right-2.5 top-2.5 flex h-9 w-9 cursor-grab items-center justify-center rounded-xl bg-slate-900/80 text-white backdrop-blur-sm transition hover:bg-emerald-700 active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-emerald-800">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5">{movie.genre}</span>
            <span>★ {movie.rating.toFixed(1)}</span>
          </div>
          <h2 className="mt-2 text-base font-bold text-slate-900">
            <Link to={`/item/${movie.id}`} className="hover:text-emerald-700 focus:outline-none focus:underline">
              {movie.title}
            </Link>
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Đạo diễn: <strong className="font-medium text-slate-800">{movie.director}</strong> · {movie.year}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{truncateText(movie.synopsis, 88)}</p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-sm font-bold text-emerald-800">{formatCurrency(movie.rentalPrice)}</span>
          <div className="flex items-center gap-1.5">
            <Link
              to={`/item/${movie.id}`}
              className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              Chi tiết
            </Link>
            <button
              type="button"
              onClick={() => onEdit(movie)}
              aria-label={`Chỉnh sửa phim ${movie.title}`}
              className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onDelete(movie.id)}
              aria-label={`Xóa phim ${movie.title}`}
              className="rounded-lg p-1.5 text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
