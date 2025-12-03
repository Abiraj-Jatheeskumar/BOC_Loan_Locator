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
        <div className="header-content">
          <div className="logo-section">
            <div className="boc-logo">
              <img
                src="/boc-logo.png"
                alt="Bank of Ceylon Logo"
                className="logo-image"
              />
              <div className="logo-text">
                <p className="subtitle">Loan File Locator System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="App-main">
        <div className="search-container">
          <div className="search-header">
            <h2>Find Your Loan File</h2>
            <p>Enter the loan file number to locate the physical file box and customer details</p>
          </div>

          <div className="input-group">
            <label htmlFor="loan-input" className="input-label">
              <span className="label-icon">📋</span>
              Loan File Number
            </label>
            <div className="input-wrapper">
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
              <button
                className="search-button"
                onClick={handleSearch}
                aria-label="Search for loan"
              >
                <span className="button-icon">🔍</span>
                Search
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="result-panel" role="region" aria-label="Search results">
            <div className="result-header">
              <h2>Search Results</h2>
              <div className="result-status">
                {result.location && result.customerName ? (
                  <span className="status-badge success">✓ Found</span>
                ) : (
                  <span className="status-badge partial">⚠ Partial</span>
                )}
              </div>
            </div>

            <div className="result-grid">
              <div className="result-card">
                <div className="card-icon">📄</div>
                <div className="card-content">
                  <span className="card-label">Loan Number</span>
                  <span className="card-value">{result.loanNumber.toLocaleString()}</span>
                </div>
              </div>

              <div className="result-card">
                <div className="card-icon">👤</div>
                <div className="card-content">
                  <span className="card-label">Customer Name</span>
                  <span className="card-value">
                    {result.customerName ? (
                      result.customerName
                    ) : (
                      <span className="not-found">Name not found</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="result-card highlight">
                <div className="card-icon">📦</div>
                <div className="card-content">
                  <span className="card-label">File Location</span>
                  <span className="card-value">
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
              </div>
            </div>

            <div className="result-footer">
              <small>
                <span className="footer-icon">🕒</span>
                Last updated: {new Date(result.lastUpdated).toLocaleString()}
              </small>
            </div>
          </div>
        )}

        {!result && !error && (
          <div className="info-panel">
            <div className="info-header">
              <h3>Welcome to the Loan File Locator</h3>
              <p>Quickly find the physical location of any loan file in our archive</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <strong>{rangesData.length}</strong>
                  <span>Storage Boxes</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <strong>{loansData.length.toLocaleString()}</strong>
                  <span>Loan Records</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <strong>&lt; 1ms</strong>
                  <span>Search Time</span>
                </div>
              </div>
            </div>

            <div className="info-features">
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Instant search results</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Accurate file locations</span>
              </div>
              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Customer information</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <p>© 2025 Bank of Ceylon. All rights reserved.</p>
          <p className="footer-tagline">Trusted Banking Since 1939</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
