# Loan Locator - Test Cases

## Test Data Samples

Based on the extracted data, here are 5 test cases to verify the application:

### Test Case 1: Valid Loan with Both Name and Location
**Input:** `76152020`
**Expected Output:**
- Loan Number: 76152020
- Customer Name: N ABIRAMI
- Location: Box 1
- Status: ✅ Success

### Test Case 2: Valid Loan with Name but Outside All Ranges
**Input:** `99999999` (if exists in loans but not in ranges)
**Note:** Based on our data, all loans appear to be within ranges. Using a loan at range boundary instead.
**Alternate Input:** `79855699`
**Expected Output:**
- Loan Number: 79855699
- Customer Name: SASEKARAN S
- Location: Box 1
- Status: ✅ Success

### Test Case 3: Loan Number in Range but Not in Customer List
**Input:** `76200000` (within Box 1 range: 76152020-79855699)
**Expected Output:**
- Loan Number: 76200000
- Customer Name: Name not found
- Location: Box 1
- Status: ⚠️ Partial (location found, name not found)

### Test Case 4: Loan Number Outside All Ranges
**Input:** `12345678`
**Expected Output:**
- Loan Number: 12345678
- Customer Name: Name not found
- Location: Location not found
- Status: ❌ Not found

### Test Case 5: Invalid Input (Non-numeric)
**Input:** `ABC123`
**Expected Output:**
- Error Message: "Loan number must contain only digits"
- Status: ❌ Validation error

## Additional Test Cases

### Test Case 6: Empty Input
**Input:** `` (empty string)
**Expected Output:**
- Error Message: "Please enter a loan number"
- Status: ❌ Validation error

### Test Case 7: Loan from Different Box
**Input:** `80048531`
**Expected Output:**
- Loan Number: 80048531
- Customer Name: KAVITHAS K
- Location: Box 2
- Status: ✅ Success

### Test Case 8: Leading/Trailing Spaces
**Input:** `  76152020  `
**Expected Output:**
- Should trim spaces and work correctly
- Loan Number: 76152020
- Customer Name: N ABIRAMI
- Location: Box 1
- Status: ✅ Success

## Data Statistics

- **Total Ranges:** 28 boxes
- **Total Loans:** 556 customer records
- **Range Coverage:** 76152020 to 87713991 (approximate)

## Testing Instructions

1. Start the development server: `npm start`
2. Open http://localhost:3000 in your browser
3. Test each case above by entering the input value
4. Verify the output matches the expected results
5. Check that error messages display correctly for invalid inputs
6. Verify that the Enter key triggers search
7. Confirm accessibility features (labels, aria attributes)

## Automated Testing (Future Enhancement)

To add automated tests, create `src/App.test.js`:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders loan locator heading', () => {
  render(<App />);
  const heading = screen.getByText(/Loan Locator/i);
  expect(heading).toBeInTheDocument();
});

test('shows error for non-numeric input', () => {
  render(<App />);
  const input = screen.getByLabelText(/Loan file number input/i);
  const button = screen.getByText(/Search/i);
  
  fireEvent.change(input, { target: { value: 'ABC123' } });
  fireEvent.click(button);
  
  expect(screen.getByText(/must contain only digits/i)).toBeInTheDocument();
});
```
