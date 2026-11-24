import React, { useMemo, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useMovies } from '../context/MovieContext';
import { Header } from '../components/Header';
import { SortableMovieCard } from '../components/SortableMovieCard';
import { MovieModal } from '../components/MovieModal';
import { Movie } from '../types/movie';
import { debounce } from '../utils';

export const ListPage: React.FC = () => {
  const { movies, addMovie, updateMovie, deleteMovie, reorderMovies, resetMovies } = useMovies();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const applyDebouncedSearch = useMemo(() => debounce((val: string) => setDebouncedQuery(val.trim().toLowerCase()), 250), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    applyDebouncedSearch(e.target.value);
  };

  const filteredMovies = useMemo(() => {
    if (!debouncedQuery) return movies;
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(debouncedQuery) ||
        m.director.toLowerCase().includes(debouncedQuery) ||
        m.genre.toLowerCase().includes(debouncedQuery),
    );
  }, [movies, debouncedQuery]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = movies.findIndex((m) => m.id === active.id);
    const newIndex = movies.findIndex((m) => m.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderMovies(arrayMove(movies, oldIndex, newIndex));
    }
  };

  const handleSaveMovie = (data: Omit<Movie, 'id'>, existingId?: string) => {
    if (existingId) updateMovie({ ...data, id: existingId });
    else addMovie(data);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header totalMovies={movies.length} onOpenCreate={() => { setEditingMovie(null); setIsModalOpen(true); }} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-900 to-teal-800 p-6 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Thư Viện Phim Chọn Lọc</h1>
              <p className="mt-1.5 max-w-2xl text-sm text-emerald-100">
                Kéo biểu tượng 6 chấm ở góc phải mỗi thẻ phim để sắp xếp danh sách ưu tiên. Mọi thay đổi thêm, sửa, xóa và vị trí đều tự động lưu vào trình duyệt.
              </p>
            </div>
            <button type="button" onClick={resetMovies} className="self-start rounded-xl border border-emerald-300/40 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white md:self-auto">
              Khôi phục dữ liệu mẫu
            </button>
          </div>
        </section>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <label htmlFor="search-movies" className="sr-only">Tìm kiếm phim</label>
            <input id="search-movies" type="search" value={searchTerm} onChange={handleSearchChange} placeholder="Tìm nhanh theo tên phim, đạo diễn, thể loại..." className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none" />
          </div>
          <p className="text-sm font-medium text-slate-600">
            Hiển thị <strong className="text-slate-900">{filteredMovies.length}</strong> / {movies.length} phim
          </p>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-base font-semibold text-slate-800">Không tìm thấy bộ phim phù hợp.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredMovies.map((m) => m.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredMovies.map((movie) => (
                  <SortableMovieCard key={movie.id} movie={movie} onEdit={(m) => { setEditingMovie(m); setIsModalOpen(true); }} onDelete={deleteMovie} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </main>
      <MovieModal isOpen={isModalOpen} editingMovie={editingMovie} onClose={() => setIsModalOpen(false)} onSave={handleSaveMovie} />
    </div>
  );
};
