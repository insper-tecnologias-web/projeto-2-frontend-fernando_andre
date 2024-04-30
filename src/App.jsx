import axios from "axios";
import { useEffect, useState } from "react";
import AppBar from "./components/Appbar";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [favorites, setFavorites] = useState(new Set()); // Usando um Set para manter os favoritos
  const [pagFavorites, setPagFavorites] = useState(false) // botap boleano para mostrar os favoritos

  const carregaCriptomoedas = () => {
    axios.get("http://127.0.0.1:8000/api/moedas/")
         .then(res => {
           setCryptos(res.data);
           setFilteredCryptos(res.data);  // Inicializa com todos os dados
         })
         .catch(err => console.error("Failed to load cryptos:", err));
  };

  const carregaFavoritos = async () => {
    const result = await axios.get("http://127.0.0.1:8000/api/favoritar/");
    console.log(result.data)
    setFavorites(new Set(result.data)); // Assumindo que a resposta é uma lista de objetos com 'symbol'
  };


  const toggleBoolean = () => {
    setPagFavorites(!pagFavorites);
    carregaFavoritos();
  };

  useEffect(() => {
    carregaCriptomoedas();
  }, []);

  const handleSearch = async (searchTerm) => {
    if (searchTerm) {
      const results = cryptos.filter(crypto => crypto.symbol.includes(searchTerm));
      setFilteredCryptos(results);
    } else {
      setFilteredCryptos(cryptos);  
    }
  };

  const toggleFavorite = (symbol) => {
    axios.post('http://127.0.0.1:8000/api/favoritar/', { symbol })
      .then(res => {
        // Atualiza o estado local com base na resposta do servidor
        const newFavorites = new Set(favorites);
        if (newFavorites.has(symbol)) {
          newFavorites.delete(symbol);
        } else {
          newFavorites.add(symbol);
        }
        setFavorites(newFavorites);
      })
  };
  
  if (pagFavorites) {
    return (
      <>
        <AppBar />
        <main className="container">
          <SearchBar onSearch={handleSearch} />
          <div className="card-container">
            {Array.from(favorites).map((crypto) => (
              <div key={`crypto__${crypto.symbol}`} className="card">
                <h3 className="card-title">{crypto.nome}</h3>
                <div className="card-content">Price: ${crypto.preco}</div>
              </div>
            ))}
          </div>
        </main>
      </>
    );
  }
  else {
    return (
      <>
        <AppBar />
        <main className="container">
          <SearchBar onSearch={handleSearch} />
          <button  
            className="favoritos"
            onClick={()=>toggleBoolean()}
          >
            Favoritos
          </button>
          <div className="card-container">
            {filteredCryptos.map((crypto, index) => (
              <div key={crypto.symbol || `crypto__${index}`} className="card">
                <h3 className="card-title">
                  {crypto.symbol}
                  <button 
                      className={`favorite-button ${favorites && favorites.has(crypto.symbol) ? "favorited" : ""}`}
                      onClick={() => toggleFavorite(crypto.symbol)}
                  >
                      {favorites && favorites.has(crypto.symbol) ? "★" : "☆"}
                  </button>
                </h3>
                <div className="card-content">Price: ${crypto.price || 'Unavailable'}</div>
              </div>
            ))}
          </div>

        </main>
      </>
    );
  }
}
export default App;