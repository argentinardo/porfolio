import React from 'react';
import PortfolioSimple from './components/PortfolioSimple';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <PortfolioSimple />
      </ThemeProvider>
    </div>
  );
}

export default App;
