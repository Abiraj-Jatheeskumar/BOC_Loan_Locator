# Loan Locator

A production-ready React single-page application for Bank of Ceylon staff to quickly locate loan files by entering a loan number. The app displays the Box/Folder location and customer name instantly.

## 🆕 NEW: Self-Service Admin Panel

Clients can now manage all loan and box data themselves without code changes or backend infrastructure! 

**Features:**
- ✅ Add/Edit/Delete loans and box ranges
- ✅ Search and filter data in real-time
- ✅ Export/Import JSON for backups
- ✅ Password-protected access
- ✅ All changes save automatically in browser
- ✅ Works on all devices (desktop, tablet, mobile)
- ✅ Zero backend - pure client-side solution

**Quick Access:** Click the "⚙️ Admin" button → Login with password → Start managing data!

📖 **[Read Client Admin Guide](CLIENT_ADMIN_GUIDE.md)** for detailed instructions.

## Features

### Search System
- 🔍 **Fast Lookup**: O(1) customer name lookup using Map data structure
- 📦 **Range-Based Location**: Automatically determines Box location from loan number ranges
- ✅ **Input Validation**: Accepts only numeric loan numbers with helpful error messages
- ♿ **Accessible**: Built with ARIA labels and semantic HTML
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, professional interface with smooth animations

### Admin Panel
- 🔐 **Secure**: Password-protected admin access
- 📝 **CRUD Operations**: Full create, read, update, delete functionality
- 💾 **LocalStorage**: All data persists in browser (no backend needed)
- 📤 **Export/Import**: Backup and restore data via JSON files
- 🔍 **Real-time Search**: Filter loans by number or name
- 📊 **Live Stats**: See total loans and boxes at a glance

## Data

- **32 Boxes** containing loan files
- **556 Loan records** with customer names
- Last updated: 2025-12-03

## Quick Start

### Prerequisites

- Node.js 14+ and npm

### Installation

```bash
# Clone or download the project
cd loan-locator

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Usage

1. Enter a loan file number in the input field
2. Click "Search" or press Enter
3. View the results:
   - Loan Number
   - Customer Name (or "Name not found")
   - Box Location (or "Location not found")
   - Last updated timestamp

## Admin Panel Usage

### For Clients

1. Click **"⚙️ Admin"** button (top-right corner)
2. Enter admin password (default: `admin123`)
3. Choose between:
   - **📋 Loans Tab**: Manage loan records
   - **📦 Box Ranges Tab**: Manage box locations
4. Use the interface to:
   - Add new records
   - Edit existing records
   - Delete records
   - Search/filter data
   - Export data for backup
   - Import data to restore

### For Developers

- **Change Password**: Edit `src/components/AdminPanel.js` line 19
- **Customize UI**: Modify `src/components/AdminPanel.css`
- **Technical Details**: See [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)
- **Setup Guide**: See [SETUP.md](SETUP.md)

## Project Structure

```
loan-locator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AdminPanel.js     # Admin interface (NEW)
│   │   └── AdminPanel.css    # Admin styling (NEW)
│   ├── data/
│   │   ├── ranges.json       # Box ranges (32 boxes)
│   │   └── loans.json         # Loan-to-customer mapping (556 records)
│   ├── App.js                 # Main application component (UPDATED)
│   ├── App.css                # Application styles (UPDATED)
│   ├── index.js               # React entry point
│   └── index.css              # Global styles
├── CLIENT_ADMIN_GUIDE.md      # User documentation (NEW)
├── TECHNICAL_DOCS.md          # Developer documentation (NEW)
├── SETUP.md                   # Deployment guide (NEW)
├── package.json
├── test-data.md               # Test cases and validation
└── README.md                 # This file
```

## Deploying to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Loan Locator app"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/loan-locator.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `loan-locator` repository
4. Configure project:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `build` (default)
   - **Install Command**: `npm install` (default)
5. Click "Deploy"

Your app will be live at `https://loan-locator.vercel.app` (or similar)

### Step 3: Update Data Files

When you need to update the loan data:

1. Update `src/data/ranges.json` and/or `src/data/loans.json`
2. Update the `lastUpdated` timestamp in `src/App.js` (line 19)
3. Commit and push changes:
   ```bash
   git add src/data/
   git commit -m "Update loan data"
   git push
   ```
4. Vercel will automatically redeploy with the new data

## Data File Formats

### ranges.json
```json
[
  {
    "start": 76152020,
    "end": 79855699,
    "location": "Box 1"
  }
]
```

### loans.json
```json
[
  {
    "loan": 76152020,
    "name": "N ABIRAMI"
  }
]
```

## Testing

See `test-data.md` for comprehensive test cases including:
- Valid loans with both name and location
- Loans in range but without customer data
- Loans outside all ranges
- Invalid input validation
- Edge cases

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security & Privacy

- All data is stored locally in JSON files
- No external API calls
- No user data collection
- Client-side only processing

## Performance

- **O(1)** customer name lookup using JavaScript Map
- **O(n)** location lookup (linear search through 32 ranges)
- Typical search time: < 1ms

## Future Enhancements

- Binary search for range lookup (O(log n))
- Export search results to CSV
- Search history
- Bulk lookup from CSV file
- Admin panel for data management
- Automated tests with Jest and React Testing Library

## License

Proprietary - Bank of Ceylon

## Support

For issues or questions, contact the IT department.

---

**Built with React** | **Last Updated: December 2025**
