import React from 'react';

const PLACEHOLDER = 'https://via.placeholder.com/100x148?text=No+Poster';

function MovieCard({ movie, onAdd, isAdded }) {
  return (
    <div className="movie-card">
      <img
        className="movie-poster"
        src={movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER}
        alt={movie.Title}
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <span className="movie-year">{movie.Year}</span>
      </div>
      <button
        className={`add-btn ${isAdded ? 'added' : ''}`}
        onClick={() => onAdd(movie)}
        disabled={isAdded}
      >
        {isAdded ? '✓ Added' : '+ Favorite'}
      </button>
    </div>
  );
}

export default MovieCard;