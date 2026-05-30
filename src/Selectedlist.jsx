import React from 'react';
import { Link } from 'react-router-dom';

function SelectedList({ selected, listName, setListName, onRemove, onSave, savedLink, saving }) {
  return (
    <div className="selected-list">
      <h2 className="sidebar-title">Seçilmiş Filmlər</h2>

      
      <input
        className="list-name-input"
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        disabled={!!savedLink}
        placeholder="Siyahının adı..."
      />

      
      {selected.length === 0 ? (
        <p className="empty-msg">Hələ film seçilməyib</p>
      ) : (
        <ul className="selected-items">
          {selected.map((movie) => (
            <li key={movie.imdbID} className="selected-item">
              <span className="selected-title">{movie.Title}</span>
              <button
                className="remove-btn"
                onClick={() => onRemove(movie.imdbID)}
                aria-label="Sil"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      
      {savedLink ? (
        <div className="saved-actions">
          <a
            className="saved-link"
            href={savedLink}
            target="_blank"
            rel="noreferrer"
          >
            🔗 Siyahıya keçid
          </a>
          <Link to="/all-lists" className="all-lists-btn">
            📋 Bütün Siyahıları Gör
          </Link>
        </div>
      ) : (
        <button
          className="save-btn"
          onClick={onSave}
          disabled={selected.length === 0 || saving}
        >
          {saving ? 'Saxlanılır...' : '💾 Siyahını yadda saxla'}
        </button>
      )}
    </div>
  );
}

export default SelectedList;