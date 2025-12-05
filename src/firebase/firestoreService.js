// Firestore Service - Handles all database operations
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  query,
  orderBy 
} from 'firebase/firestore';
import { db, COLLECTIONS } from './config';
import loansData from '../data/loans.json';
import rangesData from '../data/ranges.json';

// ==================== LOANS OPERATIONS ====================

/**
 * Get all loans from Firestore
 * @returns {Promise<Array>} Array of loan objects
 */
export const getAllLoans = async () => {
  try {
    const loansCol = collection(db, COLLECTIONS.LOANS);
    const q = query(loansCol, orderBy('loan', 'asc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // If no loans in Firestore, initialize with default data
      console.log('No loans found, initializing with default data...');
      await initializeLoans();
      return loansData;
    }
    
    const loans = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return loans;
  } catch (error) {
    console.error('Error getting loans:', error);
    // Fallback to JSON data if Firestore fails
    return loansData;
  }
};

/**
 * Add a new loan to Firestore
 * @param {Object} loan - Loan object {loan: number, name: string}
 * @returns {Promise<boolean>} Success status
 */
export const addLoan = async (loan) => {
  try {
    const loanDoc = doc(db, COLLECTIONS.LOANS, loan.loan.toString());
    await setDoc(loanDoc, {
      loan: loan.loan,
      name: loan.name,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error adding loan:', error);
    throw error;
  }
};

/**
 * Update an existing loan
 * @param {Object} loan - Updated loan object
 * @returns {Promise<boolean>} Success status
 */
export const updateLoan = async (loan) => {
  try {
    const loanDoc = doc(db, COLLECTIONS.LOANS, loan.loan.toString());
    await setDoc(loanDoc, {
      loan: loan.loan,
      name: loan.name,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating loan:', error);
    throw error;
  }
};

/**
 * Delete a loan from Firestore
 * @param {number} loanNumber - Loan number to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteLoan = async (loanNumber) => {
  try {
    const loanDoc = doc(db, COLLECTIONS.LOANS, loanNumber.toString());
    await deleteDoc(loanDoc);
    return true;
  } catch (error) {
    console.error('Error deleting loan:', error);
    throw error;
  }
};

/**
 * Initialize Firestore with default loans data
 * @returns {Promise<boolean>} Success status
 */
export const initializeLoans = async () => {
  try {
    const batch = writeBatch(db);
    
    loansData.forEach(loan => {
      const loanDoc = doc(db, COLLECTIONS.LOANS, loan.loan.toString());
      batch.set(loanDoc, {
        loan: loan.loan,
        name: loan.name,
        updatedAt: new Date().toISOString()
      });
    });
    
    await batch.commit();
    console.log('Loans initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing loans:', error);
    throw error;
  }
};

/**
 * Import loans from JSON (replaces all existing loans)
 * @param {Array} loans - Array of loan objects
 * @returns {Promise<boolean>} Success status
 */
export const importLoans = async (loans) => {
  try {
    // Delete all existing loans
    await clearAllLoans();
    
    // Add new loans in batches (Firestore limit: 500 per batch)
    const batchSize = 500;
    for (let i = 0; i < loans.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchLoans = loans.slice(i, i + batchSize);
      
      batchLoans.forEach(loan => {
        const loanDoc = doc(db, COLLECTIONS.LOANS, loan.loan.toString());
        batch.set(loanDoc, {
          loan: loan.loan,
          name: loan.name,
          updatedAt: new Date().toISOString()
        });
      });
      
      await batch.commit();
    }
    
    return true;
  } catch (error) {
    console.error('Error importing loans:', error);
    throw error;
  }
};

/**
 * Clear all loans from Firestore
 * @returns {Promise<boolean>} Success status
 */
export const clearAllLoans = async () => {
  try {
    const loansCol = collection(db, COLLECTIONS.LOANS);
    const snapshot = await getDocs(loansCol);
    
    // Delete in batches
    const batchSize = 500;
    const docs = snapshot.docs;
    
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchDocs = docs.slice(i, i + batchSize);
      
      batchDocs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing loans:', error);
    throw error;
  }
};

// ==================== RANGES OPERATIONS ====================

/**
 * Get all ranges from Firestore
 * @returns {Promise<Array>} Array of range objects
 */
export const getAllRanges = async () => {
  try {
    const rangesCol = collection(db, COLLECTIONS.RANGES);
    const q = query(rangesCol, orderBy('start', 'asc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // If no ranges in Firestore, initialize with default data
      console.log('No ranges found, initializing with default data...');
      await initializeRanges();
      return rangesData;
    }
    
    const ranges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return ranges;
  } catch (error) {
    console.error('Error getting ranges:', error);
    // Fallback to JSON data if Firestore fails
    return rangesData;
  }
};

/**
 * Add a new range to Firestore
 * @param {Object} range - Range object {start: number, end: number, location: string}
 * @returns {Promise<boolean>} Success status
 */
export const addRange = async (range) => {
  try {
    const rangeId = `${range.start}-${range.end}`;
    const rangeDoc = doc(db, COLLECTIONS.RANGES, rangeId);
    await setDoc(rangeDoc, {
      start: range.start,
      end: range.end,
      location: range.location,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error adding range:', error);
    throw error;
  }
};

/**
 * Update an existing range
 * @param {string} oldId - Old document ID to delete
 * @param {Object} range - Updated range object
 * @returns {Promise<boolean>} Success status
 */
export const updateRange = async (oldId, range) => {
  try {
    // Delete old document
    if (oldId) {
      const oldDoc = doc(db, COLLECTIONS.RANGES, oldId);
      await deleteDoc(oldDoc);
    }
    
    // Create new document with new ID
    const rangeId = `${range.start}-${range.end}`;
    const rangeDoc = doc(db, COLLECTIONS.RANGES, rangeId);
    await setDoc(rangeDoc, {
      start: range.start,
      end: range.end,
      location: range.location,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating range:', error);
    throw error;
  }
};

/**
 * Delete a range from Firestore
 * @param {string} rangeId - Range document ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteRange = async (rangeId) => {
  try {
    const rangeDoc = doc(db, COLLECTIONS.RANGES, rangeId);
    await deleteDoc(rangeDoc);
    return true;
  } catch (error) {
    console.error('Error deleting range:', error);
    throw error;
  }
};

/**
 * Initialize Firestore with default ranges data
 * @returns {Promise<boolean>} Success status
 */
export const initializeRanges = async () => {
  try {
    const batch = writeBatch(db);
    
    rangesData.forEach(range => {
      const rangeId = `${range.start}-${range.end}`;
      const rangeDoc = doc(db, COLLECTIONS.RANGES, rangeId);
      batch.set(rangeDoc, {
        start: range.start,
        end: range.end,
        location: range.location,
        updatedAt: new Date().toISOString()
      });
    });
    
    await batch.commit();
    console.log('Ranges initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing ranges:', error);
    throw error;
  }
};

/**
 * Import ranges from JSON (replaces all existing ranges)
 * @param {Array} ranges - Array of range objects
 * @returns {Promise<boolean>} Success status
 */
export const importRanges = async (ranges) => {
  try {
    // Delete all existing ranges
    await clearAllRanges();
    
    // Add new ranges
    const batch = writeBatch(db);
    
    ranges.forEach(range => {
      const rangeId = `${range.start}-${range.end}`;
      const rangeDoc = doc(db, COLLECTIONS.RANGES, rangeId);
      batch.set(rangeDoc, {
        start: range.start,
        end: range.end,
        location: range.location,
        updatedAt: new Date().toISOString()
      });
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error importing ranges:', error);
    throw error;
  }
};

/**
 * Clear all ranges from Firestore
 * @returns {Promise<boolean>} Success status
 */
export const clearAllRanges = async () => {
  try {
    const rangesCol = collection(db, COLLECTIONS.RANGES);
    const snapshot = await getDocs(rangesCol);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error clearing ranges:', error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if Firebase is properly configured
 * @returns {boolean} Configuration status
 */
export const isFirebaseConfigured = () => {
  try {
    return db !== null && db !== undefined;
  } catch (error) {
    return false;
  }
};

/**
 * Test Firebase connection
 * @returns {Promise<boolean>} Connection status
 */
export const testConnection = async () => {
  try {
    const testCol = collection(db, COLLECTIONS.METADATA);
    await getDocs(testCol);
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};
