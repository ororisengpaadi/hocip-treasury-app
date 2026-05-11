# HOCIP Treasury App

Digital treasury management app for AFM Dzingidzingi Church of SA.

The app replaces manual exercise-book bookkeeping with a structured system for:
- income capture (tithes, offerings, pledges, bank interest)
- expense capture (purpose, amount, bank charges, approver)
- monthly and annual reporting
- year-to-date balances and visual dashboards
- Excel export for sharing and audit support

## Why This App

The treasurer identified recurring manual addition mistakes during month-end and year-end balancing. This app addresses that by:
- automatically calculating totals and balances
- organizing records by financial year
- generating consistent monthly and annual summaries

## Financial Year Model

The system is configured for this church financial year:
- October 2025 to September 2026

All monthly reporting and annual rollups follow this structure.

## Core Features

- Dashboard with:
	- year-to-date income
	- year-to-date expenses
	- current month balance
	- income vs expense chart
	- recent transaction snapshots
- Income page:
	- date, receipt, contributor name
	- category entry for tithes, offerings, pledges, bank interest
	- auto-computed total per record
- Expenses page:
	- date, purpose, amount, bank charges, approved by
	- tracked totals for amount and charges
- Monthly report:
	- category breakdowns
	- expense listing
	- monthly balance banner
	- transaction details
- Annual report:
	- month-by-month totals
	- running balance
	- Excel export
- Persistent local storage for treasury data
- Smooth route transition animations for page navigation

## Tech Stack

- Frontend: React 19, Vite, React Router
- Desktop shell: Tauri 2
- Charts: Recharts
- Date utilities: dayjs
- ID generation: uuid
- Icons: lucide-react
- Excel export: xlsx

## Project Structure

```text
src/
	components/
		Sidebar.jsx
		Sidebar.css
	context/
		DataContext.js
	pages/
		Dashboard.jsx
		Income.jsx
		Expenses.jsx
		MonthlyReport.jsx
		AnnualReport.jsx
		Page.css
	utils/
		calculations.js
		storage.js
		excelExport.js
		calculations.test.js
		financialYear.test.js
```

## Prerequisites

Install before running desktop builds:
- Node.js 18+
- Rust toolchain
- Tauri prerequisites for your OS

For macOS, install Xcode Command Line Tools if not already installed.

## Setup

```bash
npm install
```

## Run (Web Dev)

```bash
npm run dev
```

## Build (Web)

```bash
npm run build
npm run preview
```

## Run (Desktop Tauri Dev)

```bash
npm run tauri dev
```

## Build (Desktop Bundle)

```bash
npm run tauri build
```

## App Icon Generation

Generate all Tauri icon sizes from your source logo:

```bash
npm run tauri icon ./public/logo.png
```

This creates platform icon assets in src-tauri/icons.

## Test Scripts Used In This Project

Current functional test scripts are lightweight Node-based checks:

```bash
node src/utils/calculations.test.js
node src/utils/financialYear.test.js
```

These cover:
- income/expense arithmetic integrity
- month aggregation
- cross-year transaction handling
- financial year boundary behavior

## Data and Reporting Notes

- Currency display uses two-decimal formatting.
- Income totals are derived from category values to reduce manual total errors.
- Annual export produces a shareable workbook for reporting and audit preparation.

## Roadmap Ideas

- stronger role and approval controls
- immutable audit trail for edits/deletes
- historical multi-year switching
- automated backup and restore workflows

## License

Private/internal project for HOCIP treasury digitization.