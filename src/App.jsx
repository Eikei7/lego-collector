import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [collection, setCollection] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_REBRICKABLE_API_KEY;

  useEffect(() => {
    const savedData = localStorage.getItem('lego-collection');
    if (savedData) {
      try {
        setCollection(JSON.parse(savedData));
      } catch (e) {
        console.error("Kunde inte ladda samling från localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lego-collection', JSON.stringify(collection));
  }, [collection]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://rebrickable.com/api/v3/lego/sets/?search=${searchQuery}&key=${API_KEY}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      alert("Ett fel uppstod vid sökning. Kontrollera din API-nyckel.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCollection = (set) => {
    const exists = collection.find(item => item.set_num === set.set_num);
    if (!exists) {
      setCollection([...collection, set]);
    } else {
      alert("Detta set finns redan i din samling!");
    }
  };

  const removeFromCollection = (setNum) => {
    if (window.confirm("Vill du verkligen ta bort detta set?")) {
      setCollection(collection.filter(item => item.set_num !== setNum));
    }
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(collection, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `lego-collection-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (Array.isArray(json)) {
          if (window.confirm("Detta kommer att ersätta din nuvarande samling. Fortsätt?")) {
            setCollection(json);
          }
        } else {
          alert("Felaktigt filformat. JSON-filen måste innehålla en lista.");
        }
      } catch (err) {
        alert("Kunde inte läsa filen. Se till att det är en giltig JSON.");
      }
    };
    reader.readAsText(file);
  };
  const totalParts = collection.reduce((acc, set) => acc + (set.num_parts || 0), 0);

  return (
    <div className="container">
      <header>
        <h1>🧱 Lego Collector</h1>
        <p>Hantera din samling lokalt i webbläsaren.</p>
      </header>

      <section className="search-section">
  <h2>Sök i Rebrickable-databasen</h2>
  <form onSubmit={handleSearch} className="input-group">
    <input 
      type="text" 
      placeholder="Set-nummer eller namn (t.ex. 10265)..." 
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button type="submit" disabled={isLoading}>
      Sök
    </button>
  </form>

  {isLoading ? (
    <div className="spinner-container">
      <span className="loader"></span>
      <p className="loading-text">Letar efter klossar...</p>
    </div>
  ) : (
    searchResults.length > 0 && (
      <div className="lego-grid" style={{ marginTop: '20px' }}>
        {searchResults.map(set => (
          <div key={set.set_num} className="lego-card">
            <img src={set.set_img_url || 'https://via.placeholder.com/150?text=No+Image'} alt={set.name} />
            <div className="card-info">
              <h3>{set.name}</h3>
              <p>#{set.set_num}</p>
              <p>{set.num_parts} bitar ({set.year})</p>
            </div>
            <button onClick={() => addToCollection(set)}>+ Lägg till</button>
          </div>
        ))}
      </div>
    )
  )}
  {!isLoading && searchQuery && searchResults.length === 0 && (
  <p style={{ textAlign: 'center', marginTop: '20px' }}>Inga resultat hittades för "{searchQuery}".</p>
)}
</section>

      <hr />

      <section className="collection-section">
  <div className="collection-header">
    <div>
      <h2>Min samling ({collection.length})</h2>
      <p className="total-stats">
        Totalt: <strong>{totalParts.toLocaleString()}</strong> bitar
      </p>
    </div>
    <div className="data-actions">
      <button onClick={exportJSON} className="secondary-btn">Exportera JSON</button>
      <label className="file-upload">
        Importera JSON
        <input type="file" accept=".json" onChange={importJSON} hidden />
      </label>
    </div>
  </div>

        {collection.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
            Din samling är tom. Sök ovan för att lägga till dina första set!
          </p>
        ) : (
          <div className="lego-grid">
            {collection.map(set => (
              <div key={set.set_num} className="lego-card saved">
                <img src={set.set_img_url} alt={set.name} />
                <div className="card-info">
                  <h3>{set.name}</h3>
                  <p>#{set.set_num}</p>
                </div>
                <button 
                  onClick={() => removeFromCollection(set.set_num)}
                  style={{ backgroundColor: '#ff4444' }}
                >
                  Ta bort
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer>
        <p><small>Data tillhandahålls av Rebrickable API</small></p>
      </footer>
    </div>
  );
}

export default App;