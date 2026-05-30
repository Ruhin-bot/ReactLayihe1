import React from 'react';

function SearchBar({ query, setQuery, onSearch, loading }) {
  return (
    <form className="search-form" onSubmit={onSearch}>
      <input
        className="search-input"
        type="text"
        placeholder="Film adını daxil edin..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-btn" type="submit" disabled={loading}>
        {loading ? 'Axtarılır...' : 'Axtar'}
      </button>
    </form>
  );
}

export default SearchBar;