import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { Header } from '../components/Header';
import { PosterImage } from '../components/PosterImage';
import { MovieModal } from '../components/MovieModal';
import { formatCurrency } from '../utils';
import { Movie } from '../types/movie';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movies, addMovie, updateMovie, deleteMovie } = useMovies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const movie = movies.find((m) => m.id === id);

  const handleSave = (data: Omit<Movie, 'id'>, existingId?: string) => {
    if (existingId) updateMovie({ ...data, id: existingId });
    else addMovie(data);
  };

  const handleDelete = () => {
    if (!movie) return;
    deleteMovie(movie.id);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header totalMovies={movies.length} onOpenCreate={() => { setEditingMovie(null); setIsModalOpen(true); }} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Điều hướng quay lại" className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-500 hover:text-emerald-800">
            ← Quay lại danh sách phim
          </Link>
        </nav>

        {!movie ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">Không tìm thấy thông tin phim</h1>
            <Link to="/" className="mt-5 inline-block rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
              Về trang chủ thư viện
            </Link>
          </div>
        ) : (
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="bg-emerald-950 lg:col-span-2">
                <PosterImage movie={movie} className="h-full min-h-64 w-full object-cover" />
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900">{movie.genre}</span>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">IMDb ★ {movie.rating.toFixed(1)} / 10</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{movie.durationMinutes} phút</span>
                  </div>
                  <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">{movie.title}</h1>
                  <p className="mt-1 text-sm font-medium text-slate-600">Tên gốc: {movie.originalTitle} ({movie.year})</p>
                  <dl className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Đạo diễn</dt>
                      <dd className="mt-1 text-sm font-bold text-slate-900">{movie.director}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Giá thuê bản quyền</dt>
                      <dd className="mt-1 text-base font-extrabold text-emerald-800">{formatCurrency(movie.rentalPrice)}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Diễn viên chính</dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800">{movie.cast.join(', ')}</dd>
                    </div>
                  </dl>
                  <div className="mt-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Nội dung tóm tắt</h2>
                    <p className="mt-2 text-base leading-relaxed text-slate-700">{movie.synopsis}</p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                  <span className="text-xs text-slate-500">Biên tập bởi: {movie.curatorEmail}</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => { setEditingMovie(movie); setIsModalOpen(true); }} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
                      Chỉnh sửa phim
                    </button>
                    <button type="button" onClick={handleDelete} className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100">
                      Xóa phim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}
      </main>
      <MovieModal isOpen={isModalOpen} editingMovie={editingMovie} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </div>
  );
};
