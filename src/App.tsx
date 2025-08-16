import React from 'react';
import PortfolioSimple from './components/PortfolioSimple';
import LanguageSelector from './components/LanguageSelector';

function App() {
  return (
    <div className="App">
      <LanguageSelector />
      <PortfolioSimple />
    </div>
  );
}

export default App;
