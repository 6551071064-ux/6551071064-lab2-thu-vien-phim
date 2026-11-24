import React, { useEffect, useRef, useState } from 'react';
import { Movie } from '../types/movie';
import { validateEmail } from '../utils';

interface MovieModalProps {
  isOpen: boolean;
  editingMovie: Movie | null;
  onClose: () => void;
  onSave: (data: Omit<Movie, 'id'>, existingId?: string) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ isOpen, editingMovie, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [year, setYear] = useState(2024);
  const [genre, setGenre] = useState('Hành động - Phiêu lưu');
  const [director, setDirector] = useState('');
  const [castText, setCastText] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [rating, setRating] = useState(8.0);
  const [rentalPrice, setRentalPrice] = useState(75000);
  const [curatorEmail, setCuratorEmail] = useState('phong.nguyen@utc2.edu.vn');
  const [synopsis, setSynopsis] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingMovie) {
      setTitle(editingMovie.title);
      setOriginalTitle(editingMovie.originalTitle);
      setYear(editingMovie.year);
      setGenre(editingMovie.genre);
      setDirector(editingMovie.director);
      setCastText(editingMovie.cast.join(', '));
      setDurationMinutes(editingMovie.durationMinutes);
      setRating(editingMovie.rating);
      setRentalPrice(editingMovie.rentalPrice);
      setCuratorEmail(editingMovie.curatorEmail);
      setSynopsis(editingMovie.synopsis);
    } else {
      setTitle('');
      setOriginalTitle('');
      setYear(2024);
      setGenre('Tâm lý - Chính kịch');
      setDirector('');
      setCastText('');
      setDurationMinutes(120);
      setRating(8.0);
      setRentalPrice(75000);
      setCuratorEmail('phong.nguyen@utc2.edu.vn');
      setSynopsis('');
    }
    setErrorMsg('');
    setTimeout(() => firstInputRef.current?.focus(), 10);
  }, [isOpen, editingMovie]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !director.trim() || !synopsis.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Tên phim, Đạo diễn và Tóm tắt nội dung.');
      return;
    }
    if (!validateEmail(curatorEmail)) {
      setErrorMsg('Email người biên tập không đúng định dạng.');
      return;
    }
    const cast = castText.split(',').map((s) => s.trim()).filter(Boolean);
    onSave(
      {
        title: title.trim(),
        originalTitle: originalTitle.trim() || title.trim(),
        year: Number(year),
        genre: genre.trim(),
        director: director.trim(),
        cast: cast.length > 0 ? cast : ['Đang cập nhật'],
        durationMinutes: Number(durationMinutes),
        rating: Math.min(10, Math.max(0, Number(rating))),
        rentalPrice: Math.max(0, Number(rentalPrice)),
        posterColor: editingMovie?.posterColor ?? '#059669',
        curatorEmail: curatorEmail.trim(),
        synopsis: synopsis.trim(),
      },
      editingMovie?.id,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-movie-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 id="modal-movie-title" className="text-xl font-bold text-slate-900">
            {editingMovie ? 'Chỉnh sửa thông tin phim' : 'Thêm phim mới vào thư viện'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Đóng hộp thoại" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {errorMsg && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">{errorMsg}</div>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="movie-title" className="block text-sm font-semibold text-slate-800">Tên phim (Tiếng Việt) *</label>
              <input ref={firstInputRef} id="movie-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" required />
            </div>
            <div>
              <label htmlFor="movie-original" className="block text-sm font-semibold text-slate-800">Tên gốc</label>
              <input id="movie-original" type="text" value={originalTitle} onChange={(e) => setOriginalTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="movie-director" className="block text-sm font-semibold text-slate-800">Đạo diễn *</label>
              <input id="movie-director" type="text" value={director} onChange={(e) => setDirector(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" required />
            </div>
            <div>
              <label htmlFor="movie-genre" className="block text-sm font-semibold text-slate-800">Thể loại</label>
              <input id="movie-genre" type="text" value={genre} onChange={(e) => setGenre(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="movie-year" className="block text-sm font-semibold text-slate-800">Năm phát hành</label>
              <input id="movie-year" type="number" min={1900} max={2030} value={year} onChange={(e) => setYear(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="movie-duration" className="block text-sm font-semibold text-slate-800">Thời lượng (phút)</label>
              <input id="movie-duration" type="number" min={1} max={600} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="movie-rating" className="block text-sm font-semibold text-slate-800">Điểm IMDb (0 - 10)</label>
              <input id="movie-rating" type="number" step="0.1" min={0} max={10} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="movie-price" className="block text-sm font-semibold text-slate-800">Giá thuê phim (VNĐ)</label>
              <input id="movie-price" type="number" step={1000} min={0} value={rentalPrice} onChange={(e) => setRentalPrice(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="movie-cast" className="block text-sm font-semibold text-slate-800">Diễn viên (phân cách dấu phẩy)</label>
              <input id="movie-cast" type="text" value={castText} onChange={(e) => setCastText(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="movie-email" className="block text-sm font-semibold text-slate-800">Email người cập nhật *</label>
              <input id="movie-email" type="email" value={curatorEmail} onChange={(e) => setCuratorEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" required />
            </div>
          </div>
          <div>
            <label htmlFor="movie-synopsis" className="block text-sm font-semibold text-slate-800">Tóm tắt nội dung *</label>
            <textarea id="movie-synopsis" rows={3} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none" required />
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy bỏ</button>
            <button type="submit" className="rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              {editingMovie ? 'Lưu thay đổi' : 'Thêm vào thư viện'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
