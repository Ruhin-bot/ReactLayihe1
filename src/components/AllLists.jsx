import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AllLists() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = () => {
    const savedListsString = localStorage.getItem('movieLists');
    const savedLists = savedListsString ? JSON.parse(savedListsString) : [];
    setLists(savedLists.slice().reverse());
  };

  useEffect(() => {
    const handleStorageChange = () => {
      loadLists();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDelete = (id) => {
    if (confirm('Bu siyahı silmək istəyirsən?')) {
      const savedListsString = localStorage.getItem('movieLists');
      const savedLists = savedListsString ? JSON.parse(savedListsString) : [];
      const updatedLists = savedLists.filter((l) => l.id !== id);
      localStorage.setItem('movieLists', JSON.stringify(updatedLists));
      setLists(updatedLists.slice().reverse());
    }
  };

  return (
    <div className="all-lists-page">
      <header className="all-lists-header">
        <Link to="/" className="back-link">← Ana səhifə</Link>
        <h1>🎬 Yadda Saxlanmış Siyahılar</h1>
      </header>

      {lists.length === 0 ? (
        <div className="empty-state">
          <p className="empty-msg">Hələ siyahı saxlanılmayıb</p>
          <Link to="/" className="create-link">Siyahı yarat</Link>
        </div>
      ) : (
        <div className="lists-grid">
          {lists.map((list) => (
            <div key={list.id} className="list-card-container">
              <Link
                to={`/list/${list.id}`}
                className="list-card"
              >
                <div className="list-icon">🎬</div>
                <h3>{list.title}</h3>
                <p className="list-meta">{list.movieCount} film</p>
                <span className="list-date">
                  {new Date(list.createdAt).toLocaleDateString('az-AZ')}
                </span>
              </Link>
              <button
                className="delete-list-btn"
                onClick={() => handleDelete(list.id)}
                title="Sil"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllLists;
