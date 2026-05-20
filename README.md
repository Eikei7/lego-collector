# LEGO® Collector

A modern web application for managing your LEGO collection. Search through Rebrickable's extensive database and keep track of all your sets locally in your browser.

<img width="920" height="863" alt="lego1" src="https://github.com/user-attachments/assets/2ef89573-3398-4100-874e-d89709b18734" />
<img width="453" height="739" alt="lego2" src="https://github.com/user-attachments/assets/c044115c-e6ae-455e-8c79-c7747b860a48" />



## Features

- **Search Rebrickable Database** - Find LEGO sets by searching for names or set numbers
- **Save Your Collection** - All data is stored locally in your browser using localStorage
- **Detailed Information** - View piece count, year, and images for each set
- **Smart Indicators** - Search results clearly show which sets you already own
- **Statistics** - See total number of sets and pieces in your collection
- **Export/Import** - Backup or share your collection as a JSON file

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A free API key from [Rebrickable](https://rebrickable.com/api/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Eikei7/lego-collector.git
cd lego-collector
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root and add your Rebrickable API key:
```
REBRICKABLE_API_KEY=your_api_key_here
```

> **Note:** The key is kept server-side and never exposed in the browser bundle. It is read by the Netlify Function in `netlify/functions/rebrickable.js`.

4. Start the development server using the Netlify CLI (required to run the proxy function locally):
```bash
npm install -g netlify-cli   # one-time, if not already installed
npm run build               # build once so Netlify Dev has a dist folder
npx netlify dev
```

5. Open the URL shown by `netlify dev` (typically [http://localhost:8888](http://localhost:8888)) in your browser

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Deploy to Netlify

The project is ready for deployment on Netlify:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add `REBRICKABLE_API_KEY` as an environment variable in Netlify (Site settings → Environment variables)
4. Netlify will automatically use the settings from `netlify.toml`, including the proxy function in `netlify/functions/`

Every push to the main branch will automatically deploy the new version on Netlify.

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Rebrickable API** - LEGO data
- **localStorage** - Local data storage
- **CSS** - Styling

## Usage

1. **Search for Sets** - Enter a set number (e.g., 10265) or name in the search field
2. **Add to Collection** - Click "+ Add" to save a set
3. **Manage Collection** - View all your sets under "My Collection"
4. **Remove Sets** - Click "Remove" to delete a set from your collection
5. **Export Data** - Save your collection as JSON for backup
6. **Import Data** - Restore your collection from a JSON file

## Acknowledgments

- Data provided by [Rebrickable API](https://rebrickable.com/api/)
- LEGO® is a registered trademark of the LEGO Group
