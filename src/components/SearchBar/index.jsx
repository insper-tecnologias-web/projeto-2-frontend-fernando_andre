import { useState } from "react";
import "./index.css";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar">
        <form onSubmit={handleSearch}>
            <input
            type="text"
            className="search-input"
            placeholder="Digite o símbolo da cripto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            />
            <button type="submit">Buscar</button>
        </form>
    </div>
  );
}
