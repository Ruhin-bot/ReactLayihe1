import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../Searchbar.jsx';
import MovieCard from '../Moviecard.jsx';
import SelectedList from '../Selectedlist.jsx';

const OMDB_KEY = '16461cf0';
const POPULAR_MOVIES = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0071562', // The Godfather: Part II
  'tt0468569', // The Dark Knight
  'tt0050083', // 12 Angry Men
  'tt0110912', // Pulp Fiction
  'tt0109830', // Forrest Gump
  'tt0137523', // Fight Club
  'tt0108052', // Schindler's List
  'tt0167260', // The Lord of the Rings: The Return of the King
];

function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [listName, setListName] = useState('Yeni Siyahı');
  const [savedLink, setSavedLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true);
      try {
        const movies = await Promise.all(
          POPULAR_MOVIES.map((imdbID) =>
            fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_KEY}`)
              .then((r) => r.json())
          )
        );
        setResults(movies.filter((m) => m.Title));
      } catch {
        setError('Filmler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchPopularMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_KEY}`
      );
      const data = await res.json();
      if (data.Response === 'True') {
        setResults(data.Search);
      } else {
        setError(data.Error || 'Film tapılmadı');
      }
    } catch {
      setError('Axtarış zamanı xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (movie) => {
    if (selected.find((m) => m.imdbID === movie.imdbID)) return;
    setSelected([...selected, movie]);
  };

  const handleRemove = (imdbID) => {
    setSelected(selected.filter((m) => m.imdbID !== imdbID));
  };

  const handleSave = async () => {
    if (selected.length === 0) return;
    setSaving(true);
    try {
      
      const listId = Date.now().toString();
      const savedLists = JSON.parse(localStorage.getItem('movieLists')) || [];
      const newList = {
        id: listId,
        title: listName,
        movieCount: selected.length,
        movies: selected.map((m) => m.imdbID),
        createdAt: new Date().toISOString(),
      };
      savedLists.push(newList);
      localStorage.setItem('movieLists', JSON.stringify(savedLists));
      
      setSavedLink(`${window.location.origin}/list/${listId}`);
      
      setSelected([]);
      setListName('Yeni Siyahı');
      
    } catch (err) {
      console.error('Xəta:', err);
      alert('Saxlamaq mümkün olmadı');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-layout">
      <main className="main-area">
        <header className="site-header">
          <span className="logo">🎬 MustSee</span>
        </header>

        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          loading={loading}
        />

        {error && <p className="error-msg">{error}</p>}

        <div className="results-grid">
          {results.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onAdd={handleAdd}
              isAdded={!!selected.find((m) => m.imdbID === movie.imdbID)}
            />
          ))}
        </div>
      </main>

      <aside className="sidebar">
        <SelectedList
          selected={selected}
          listName={listName}
          setListName={setListName}
          onRemove={handleRemove}
          onSave={handleSave}
          savedLink={savedLink}
          saving={saving}
        />
      </aside>
    </div>
  );
}

export default HomePage;