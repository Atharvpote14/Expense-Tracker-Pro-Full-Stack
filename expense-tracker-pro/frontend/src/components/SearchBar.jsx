import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value, onChange }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 400);
    return () => clearTimeout(timer);
  }, [local]);

  useEffect(() => {
    setLocal(value || '');
  }, [value]);

  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search expenses..."
        value={local}
        onChange={e => setLocal(e.target.value)}
        className="search-input"
      />
      {local && (
        <button className="search-clear" onClick={() => { setLocal(''); onChange(''); }}>
          <FiX />
        </button>
      )}
    </div>
  );
}
