import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const OMDB_KEY = '16461cf0';
const PLACEHOLDER = 'https://via.placeholder.com/80x120?text=No+Poster';

function ListPage() {
  const { id } = useParams();
  const [listData, setListData] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchList = async () => {
      try {
        const savedLists = JSON.parse(localStorage.getItem('movieLists')) || [];
        const localList = savedLists.find((l) => l.id === id);
        
        if (localList) {
          setListData(localList);
          
          const movieDetails = await Promise.all(
            localList.movies.map((imdbID) =>
              fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_KEY}`)
                .then((r) => r.json())
            )
          );
          setMovies(movieDetails);
        } else {
          const res = await fetch(`https://acb-api.algoritmika.org/api/movies/list/${id}`);
          const data = await res.json();
          setListData(data);

          const movieDetails = await Promise.all(
            data.movies.map((imdbID) =>
              fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_KEY}`)
                .then((r) => r.json())
            )
          );
          setMovies(movieDetails);
        }
      } catch (err) {
        console.error('Xəta:', err);
        setError('Siyahı tapılmadı və ya yüklənə bilmədi');
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [id]);

  if (loading) return <div className="list-page"><p className="loading">Yüklənir...</p></div>;
  if (error) return <div className="list-page"><p className="error-msg">{error}</p></div>;

  return (
    <div className="list-page">
      <header className="list-header">
        <Link to="/" className="back-link">← Ana səhifə</Link>
        <h1 className="list-page-title">🎬 {listData?.title}</h1>
        <p className="list-count">{movies.length} film</p>
      </header>

      <div className="list-movies">
        {movies.map((movie) => (
          <a
            key={movie.imdbID}
            className="list-movie-item"
            href={`https://www.imdb.com/title/${movie.imdbID}/`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="list-poster"
              src={movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER}
              alt={movie.Title}
            />
            <div className="list-movie-info">
              <h3 className="list-movie-title">{movie.Title}</h3>
              <span className="list-movie-year">{movie.Year}</span>
              {movie.Genre && <span className="list-movie-genre">{movie.Genre}</span>}
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <span className="list-movie-rating">⭐ {movie.imdbRating}</span>
              )}
            </div>
            <span className="imdb-badge">IMDB →</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default ListPage;