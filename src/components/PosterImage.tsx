import React, { useMemo } from 'react';
import { Movie } from '../types/movie';

interface PosterImageProps {
  movie: Movie;
  className?: string;
}

function buildPosterDataUri(movie: Movie): string {
  const safeTitle = movie.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeGenre = movie.genre.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const bg = movie.posterColor || '#059669';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="#064E3B"/></linearGradient></defs><rect width="400" height="240" fill="url(#g)"/><circle cx="355" cy="45" r="55" fill="#10B981" fill-opacity="0.18"/><circle cx="45" cy="205" r="70" fill="#34D399" fill-opacity="0.12"/><rect x="24" y="24" width="76" height="28" rx="6" fill="#FFFFFF" fill-opacity="0.18"/><text x="62" y="43" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700">${movie.year}</text><text x="24" y="138" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="22" font-weight="800">${safeTitle.slice(0, 26)}</text><text x="24" y="168" fill="#D1FAE5" font-family="system-ui, sans-serif" font-size="14" font-weight="500">${safeGenre}</text><text x="24" y="208" fill="#ECFDF5" font-family="system-ui, sans-serif" font-size="13" font-weight="600">IMDb ★ ${movie.rating.toFixed(1)} • ${movie.durationMinutes} phút</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const PosterImage: React.FC<PosterImageProps> = ({ movie, className = '' }) => {
  const src = useMemo(() => movie.posterUrl || buildPosterDataUri(movie), [movie]);
  return (
    <img
      src={src}
      alt={`Áp phích phim ${movie.title} (${movie.year}) - Thể loại ${movie.genre}, đạo diễn ${movie.director}`}
      width={400}
      height={240}
      loading="lazy"
      className={className}
    />
  );
};
