import React, { useState, useMemo } from 'react';
import './App.css';
import rangesData from './data/ranges.json';
import loansData from './data/loans.json';

function App() {
  const [loanNumber, setLoanNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Create a Map for O(1) loan lookup
  const loansMap = useMemo(() => {
    const map = new Map();
    loansData.forEach(loan => {
      map.set(loan.loan, loan.name);
    });
    return map;
  }, []);

  // Get last updated timestamp from the data files
  const lastUpdated = '2025-12-03T23:04:03+05:30';

  const handleSearch = () => {
    // Reset previous results
    setResult(null);
    setError('');

    // Validate input
    const trimmed = loanNumber.trim();
    if (!trimmed) {
      setError('Please enter a loan number');
      return;
    }

    // Check if input is numeric
    if (!/^\d+$/.test(trimmed)) {
      setError('Loan number must contain only digits');
      return;
    }

    const loanNum = parseInt(trimmed, 10);

    // Find location from ranges
    let location = null;
    for (const range of rangesData) {
      if (loanNum >= range.start && loanNum <= range.end) {
        location = range.location;
        break;
      }
    }

    // Find customer name from loans
    const customerName = loansMap.get(loanNum);

    // Build result
    const searchResult = {
      loanNumber: loanNum,
      customerName: customerName || null,
      location: location || null,
      lastUpdated: lastUpdated
    };

    setResult(searchResult);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏦 Loan Locator</h1>
        <p className="subtitle">Find loan file locations quickly</p>
      </header>

      <main className="App-main">
        <div className="search-container">
          <div className="input-group">
            <label htmlFor="loan-input" className="input-label">
              Loan File Number
            </label>
            <input
              id="loan-input"
              type="text"
              className="loan-input"
              placeholder="Enter loan number (e.g., 76152020)"
              value={loanNumber}
              onChange={(e) => setLoanNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Loan file number input"
              autoFocus
            />
          </div>
          <button 
            className="search-button" 
            onClick={handleSearch}
            aria-label="Search for loan"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            ⚠️ {error}
          </div>
        )}

        {result && (
          <div className="result-panel" role="region" aria-label="Search results">
            <h2>Search Results</h2>
            
            <div className="result-item">
              <span className="result-label">Loan Number:</span>
              <span className="result-value">{result.loanNumber}</span>
            </div>

            <div className="result-item">
              <span className="result-label">Customer Name:</span>
              <span className="result-value">
                {result.customerName ? (
                  result.customerName
                ) : (
                  <span className="not-found">Name not found</span>
                )}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">Location:</span>
              <span className="result-value">
                {result.location ? (
                  <span className="location-badge">{result.location}</span>
                ) : (
                  <span className="not-found">
                    {result.customerName 
                      ? 'Location not found (check ranges)' 
                      : 'Location not found'}
                  </span>
                )}
              </span>
            </div>

            <div className="result-footer">
              <small>Last updated: {new Date(result.lastUpdated).toLocaleString()}</small>
            </div>
          </div>
        )}

        {!result && !error && (
          <div className="info-panel">
            <p>Enter a loan file number above to find its location and customer information.</p>
            <div className="stats">
              <div className="stat-item">
                <strong>{rangesData.length}</strong>
                <span>Boxes</span>
              </div>
              <div className="stat-item">
                <strong>{loansData.length}</strong>
                <span>Loans</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>Bank of Ceylon - Loan File Management System</p>
      </footer>
    </div>
  );
}

export default App;
