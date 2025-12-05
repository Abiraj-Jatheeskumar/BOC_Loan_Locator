import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import {
  getAllLoans,
  getAllRanges,
  addLoan as addLoanToFirestore,
  updateLoan as updateLoanInFirestore,
  deleteLoan as deleteLoanFromFirestore,
  addRange as addRangeToFirestore,
  updateRange as updateRangeInFirestore,
  deleteRange as deleteRangeFromFirestore,
  importLoans as importLoansToFirestore,
  importRanges as importRangesToFirestore,
  clearAllLoans as clearAllLoansFromFirestore,
  clearAllRanges as clearAllRangesFromFirestore
} from '../firebase/firestoreService';

function AdminPanel({ onBackToSearch }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('loans');
  
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({ loan: '', name: '' });
  const [editingLoan, setEditingLoan] = useState(null);
  const [searchLoan, setSearchLoan] = useState('');
  
  const [ranges, setRanges] = useState([]);
  const [newRange, setNewRange] = useState({ start: '', end: '', location: '' });
  const [editingRange, setEditingRange] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Custom modal state
  const [modal, setModal] = useState({ show: false, type: '', title: '', message: '', onConfirm: null });
  
  // Password stored as environment variable hash (not in code)
  const ADMIN_PASSWORD_HASH = process.env.REACT_APP_ADMIN_PASSWORD_HASH || 
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'; // Default: admin123 (change in .env.local)

  // Simple SHA-256 hash function
  const hashPassword = async (password) => {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loansData, rangesData] = await Promise.all([
        getAllLoans(),
        getAllRanges()
      ]);
      setLoans(loansData);
      setRanges(rangesData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from Firebase');
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const hashedInput = await hashPassword(password);
      if (hashedInput === ADMIN_PASSWORD_HASH) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        showAlert('Login Failed', 'Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      console.error('Login error:', err);
      showAlert('Error', 'Login failed. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const showAlert = (title, message) => {
    setModal({ show: true, type: 'alert', title, message, onConfirm: null });
  };

  const showConfirm = (title, message, onConfirm) => {
    setModal({ show: true, type: 'confirm', title, message, onConfirm });
  };

  const closeModal = () => {
    setModal({ show: false, type: '', title: '', message: '', onConfirm: null });
  };

  const handleModalConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    closeModal();
  };

  const addLoan = async () => {
    if (!newLoan.loan || !newLoan.name) {
      showError('Please fill all fields');
      return;
    }
    
    const loanNumber = parseInt(newLoan.loan, 10);
    if (isNaN(loanNumber)) {
      showError('Loan number must be numeric');
      return;
    }
    
    if (loans.find(l => l.loan === loanNumber)) {
      showError('Loan number already exists');
      return;
    }
    
    try {
      setLoading(true);
      await addLoanToFirestore({ loan: loanNumber, name: newLoan.name });
      await loadData();
      setNewLoan({ loan: '', name: '' });
      showSuccess('Loan added successfully!');
    } catch (err) {
      showError('Failed to add loan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLoan = async (loan) => {
    if (!editingLoan.loan || !editingLoan.name) {
      showError('Please fill all fields');
      return;
    }
    
    const loanNumber = parseInt(editingLoan.loan, 10);
    if (isNaN(loanNumber)) {
      showError('Loan number must be numeric');
      return;
    }
    
    try {
      setLoading(true);
      
      if (loan.loan !== loanNumber) {
        await deleteLoanFromFirestore(loan.loan);
      }
      
      await updateLoanInFirestore({ loan: loanNumber, name: editingLoan.name });
      await loadData();
      setEditingLoan(null);
      showSuccess('Loan updated successfully!');
    } catch (err) {
      showError('Failed to update loan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLoan = async (loan) => {
    showConfirm(
      'Delete Loan',
      `Are you sure you want to delete loan ${loan.loan} (${loan.name})?`,
      async () => {
        try {
          setLoading(true);
          await deleteLoanFromFirestore(loan.loan);
          await loadData();
          showSuccess('Loan deleted successfully!');
        } catch (err) {
          showError('Failed to delete loan: ' + err.message);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const addRange = async () => {
    if (!newRange.start || !newRange.end || !newRange.location) {
      showError('Please fill all fields');
      return;
    }
    
    const start = parseInt(newRange.start, 10);
    const end = parseInt(newRange.end, 10);
    
    if (isNaN(start) || isNaN(end)) {
      showError('Start and End must be numeric');
      return;
    }
    
    if (start > end) {
      showError('Start cannot be greater than End');
      return;
    }
    
    try {
      setLoading(true);
      await addRangeToFirestore({ start, end, location: newRange.location });
      await loadData();
      setNewRange({ start: '', end: '', location: '' });
      showSuccess('Range added successfully!');
    } catch (err) {
      showError('Failed to add range: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRange = async (range) => {
    if (!editingRange.start || !editingRange.end || !editingRange.location) {
      showError('Please fill all fields');
      return;
    }
    
    const start = parseInt(editingRange.start, 10);
    const end = parseInt(editingRange.end, 10);
    
    if (isNaN(start) || isNaN(end)) {
      showError('Start and End must be numeric');
      return;
    }
    
    if (start > end) {
      showError('Start cannot be greater than End');
      return;
    }
    
    try {
      setLoading(true);
      await updateRangeInFirestore(range.id, { start, end, location: editingRange.location });
      await loadData();
      setEditingRange(null);
      showSuccess('Range updated successfully!');
    } catch (err) {
      showError('Failed to update range: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRange = async (range) => {
    showConfirm(
      'Delete Range',
      `Are you sure you want to delete range ${range.start}-${range.end} (${range.location})?`,
      async () => {
        try {
          setLoading(true);
          await deleteRangeFromFirestore(range.id);
          await loadData();
          showSuccess('Range deleted successfully!');
        } catch (err) {
          showError('Failed to delete range: ' + err.message);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const exportData = (type) => {
    const data = type === 'loans' ? loans : ranges;
    const cleanData = data.map(({ id, updatedAt, ...rest }) => rest);
    const dataStr = JSON.stringify(cleanData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showSuccess(`${type} exported successfully!`);
  };

  const importData = async (type, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (type === 'loans') {
          showConfirm(
            'Import Loans',
            `Import ${data.length} loans? This will replace ALL current data.`,
            async () => {
              setLoading(true);
              await importLoansToFirestore(data);
              await loadData();
              showSuccess('Loans imported successfully!');
            }
          );
        } else {
          showConfirm(
            'Import Ranges',
            `Import ${data.length} ranges? This will replace ALL current data.`,
            async () => {
              setLoading(true);
              await importRangesToFirestore(data);
              await loadData();
              showSuccess('Ranges imported successfully!');
            }
          );
        }
      } catch (error) {
        showError('Error parsing JSON file: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const clearAllData = async (type) => {
    const count = type === 'loans' ? loans.length : ranges.length;
    if (window.confirm(`⚠️ WARNING: This will permanently delete ALL ${count} ${type} from the database!\n\nThis action CANNOT be undone!\n\nAre you sure?`)) {
      if (window.confirm(`⚠️ FINAL WARNING!\n\nYou are about to delete ${count} ${type} permanently.\n\nClick OK to delete, or Cancel to keep your data.`)) {
        try {
          setLoading(true);
          if (type === 'loans') {
            await clearAllLoansFromFirestore();
            setLoans([]);
          } else {
            await clearAllRangesFromFirestore();
            setRanges([]);
          }
          showSuccess(`All ${type} deleted successfully!`);
        } catch (err) {
          showError(`Failed to clear ${type}: ` + err.message);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const filteredLoans = loans.filter(loan => 
    loan.loan.toString().includes(searchLoan) || 
    loan.name.toLowerCase().includes(searchLoan.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <button onClick={onBackToSearch} className="back-to-search-btn" title="Back to Search">
            ← Back to Search
          </button>
          <h1>🔐 Admin Login</h1>
          <p>Enter password to access the admin panel</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="login-input"
              autoFocus
            />
            <button type="submit" className="login-button">LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>⚙️ Admin Panel</h1>
          <div className="admin-actions">
            <button onClick={() => window.location.reload()} className="btn-secondary">← Back to Search</button>
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner-small"></div>
          <span>Processing...</span>
        </div>
      )}

      {error && (
        <div className="notification error-notification">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="notification success-notification">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'loans' ? 'active' : ''}`}
          onClick={() => setActiveTab('loans')}
        >
          📋 Loans ({loans.length})
        </button>
        <button 
          className={`tab ${activeTab === 'ranges' ? 'active' : ''}`}
          onClick={() => setActiveTab('ranges')}
        >
          📦 Box Ranges ({ranges.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'loans' ? (
          <div className="loans-section">
            <div className="section-header">
              <h2>Manage Loans</h2>
              <div className="section-actions">
                <input
                  type="file"
                  id="import-loans"
                  accept=".json"
                  onChange={(e) => importData('loans', e)}
                  style={{ display: 'none' }}
                />
                <label htmlFor="import-loans" className="btn-secondary">
                  📥 Import JSON
                </label>
                <button onClick={() => exportData('loans')} className="btn-secondary">
                  📤 Export JSON
                </button>
              </div>
            </div>

            <div className="add-form">
              <h3>Add New Loan</h3>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Loan Number"
                  value={newLoan.loan}
                  onChange={(e) => setNewLoan({ ...newLoan, loan: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newLoan.name}
                  onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
                />
                <button onClick={addLoan} className="btn-primary" disabled={loading}>
                  Add Loan
                </button>
              </div>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search by loan number or name..."
                value={searchLoan}
                onChange={(e) => setSearchLoan(e.target.value)}
              />
              {searchLoan && (
                <button onClick={() => setSearchLoan('')} className="clear-search">×</button>
              )}
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Loan Number</th>
                    <th>Customer Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((loan, index) => (
                    <tr key={loan.id || index}>
                      {editingLoan?.loan === loan.loan ? (
                        <>
                          <td>
                            <input
                              type="number"
                              value={editingLoan.loan}
                              onChange={(e) => setEditingLoan({ ...editingLoan, loan: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editingLoan.name}
                              onChange={(e) => setEditingLoan({ ...editingLoan, name: e.target.value })}
                            />
                          </td>
                          <td>
                            <button onClick={() => updateLoan(loan)} className="btn-success" disabled={loading}>
                              Save
                            </button>
                            <button onClick={() => setEditingLoan(null)} className="btn-secondary">
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{loan.loan}</td>
                          <td>{loan.name}</td>
                          <td className="action-buttons">
                            <button 
                              onClick={() => setEditingLoan({ ...loan })} 
                              className="btn-icon btn-edit"
                              disabled={loading}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deleteLoan(loan)} 
                              className="btn-icon btn-delete" 
                              disabled={loading}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLoans.length === 0 && (
                <div className="no-data">No loans found</div>
              )}
            </div>
          </div>
        ) : (
          <div className="ranges-section">
            <div className="section-header">
              <h2>Manage Box Ranges</h2>
              <div className="section-actions">
                <input
                  type="file"
                  id="import-ranges"
                  accept=".json"
                  onChange={(e) => importData('ranges', e)}
                  style={{ display: 'none' }}
                />
                <label htmlFor="import-ranges" className="btn-secondary">
                  📥 Import JSON
                </label>
                <button onClick={() => exportData('ranges')} className="btn-secondary">
                  📤 Export JSON
                </button>
              </div>
            </div>

            <div className="add-form">
              <h3>Add New Range</h3>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Start"
                  value={newRange.start}
                  onChange={(e) => setNewRange({ ...newRange, start: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="End"
                  value={newRange.end}
                  onChange={(e) => setNewRange({ ...newRange, end: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Location (e.g., Box 1)"
                  value={newRange.location}
                  onChange={(e) => setNewRange({ ...newRange, location: e.target.value })}
                />
                <button onClick={addRange} className="btn-primary" disabled={loading}>
                  Add Range
                </button>
              </div>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ranges.map((range, index) => (
                    <tr key={range.id || index}>
                      {editingRange?.id === range.id ? (
                        <>
                          <td>
                            <input
                              type="number"
                              value={editingRange.start}
                              onChange={(e) => setEditingRange({ ...editingRange, start: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editingRange.end}
                              onChange={(e) => setEditingRange({ ...editingRange, end: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editingRange.location}
                              onChange={(e) => setEditingRange({ ...editingRange, location: e.target.value })}
                            />
                          </td>
                          <td>
                            <button onClick={() => updateRange(range)} className="btn-success" disabled={loading}>
                              Save
                            </button>
                            <button onClick={() => setEditingRange(null)} className="btn-secondary">
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{range.start}</td>
                          <td>{range.end}</td>
                          <td>{range.location}</td>
                          <td className="action-buttons">
                            <button 
                              onClick={() => setEditingRange({ ...range })} 
                              className="btn-icon btn-edit"
                              disabled={loading}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deleteRange(range)} 
                              className="btn-icon btn-delete" 
                              disabled={loading}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {ranges.length === 0 && (
                <div className="no-data">No ranges found</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="admin-footer">
        <div className="footer-alerts">
          <div className="alert-item alert-warning">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text"><strong>Important:</strong> All changes are saved automatically and cannot be undone</span>
          </div>
          <div className="alert-item alert-info">
            <span className="alert-icon">💾</span>
            <span className="alert-text"><strong>Recommendation:</strong> Export your data regularly for backup purposes</span>
          </div>
          <div className="alert-item alert-success">
            <span className="alert-icon">✓</span>
            <span className="alert-text"><strong>Safe:</strong> Your data is protected and survives browser cache clearing</span>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {modal.show && (
        <div className="custom-modal-overlay" onClick={closeModal}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.title}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p>{modal.message}</p>
            </div>
            <div className="modal-footer">
              {modal.type === 'confirm' ? (
                <>
                  <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button className="btn-primary" onClick={handleModalConfirm}>Confirm</button>
                </>
              ) : (
                <button className="btn-primary" onClick={closeModal}>OK</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
