# FinOmaly - Frontend Team Handoff & Specification

Welcome to **FinOmaly**, an AI-driven financial forensics application designed to detect earnings manipulation using the Beneish M-Score model.

This document is your complete guide to the frontend architecture, tasks, API contracts, and workflow. While the backend team builds out the database and API logic, you have everything you need here to build out the UI independently.

---

## 1. Project Overview & Tech Stack
*   **Framework**: React 18 + Vite
*   **Routing**: React Router DOM (already configured)
*   **Styling**: Tailwind CSS (recommended) + inline styles where appropriate.
*   **Icons**: `lucide-react`
*   **Data Fetching**: Native `fetch` API (or you can install `axios`). **Important:** All API calls to protected routes must include the JWT token in the `Authorization: Bearer <token>` header.
*   **Charts/Visualizations**: Recommended to install `recharts` for financial trends and M-Score gauges.

### Current State
*   **Deployed App**: The frontend is live on Vercel, and the backend is live on Render.
*   **Authentication**: Completed. The `Login.jsx` page correctly authenticates via OAuth2, retrieves a JWT access token, and stores it in `localStorage('finomaly_token')`.
*   **Routing Architecture**: A `ProtectedRoute` wrapper is already in place in `App.jsx`.

---

## 2. Environment & Credentials

To test the frontend locally or inspect the backend data, use the following credentials.

### Environment Variables (`frontend/.env`)
Create a `.env` file in the `frontend` folder with the live Render backend URL:
```env
VITE_API_URL="https://finomaly-ejgp.onrender.com"
```

### Test User (For Login)
*   **Email:** `test@finomaly.com`
*   **Password:** `testpassword123`
*(Note: If the user doesn't exist locally yet, click "Seed Test User" on the login page first).*

### Direct Database Access (PostgreSQL)
If you need to connect directly to the Supabase database using a tool like DBeaver or TablePlus to verify data:
*   **Connection URL:** `postgresql://postgres.vdxdhbsbessupzebdaae:Trinetra189.@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres`

---

## 3. API Contract & Integration

Your global API Base URL is injected via Vite environment variables:
`const API_BASE = import.meta.env.VITE_API_URL;`

### Authentication (Completed)
*   `POST /api/v1/login/access-token`: Takes `username` and `password` (form-urlencoded). Returns `{"access_token": "...", "token_type": "bearer"}`.

### Company Management (Upcoming API)
The backend team is building these right now. You can mock the data in the UI until they are ready.
*   `GET /api/v1/companies`: Returns a list of companies for the user's organization.
    *   *Mock Response:* `[{ id: "uuid", name: "TechCorp", ticker: "TCORP", industry: "Software" }]`
*   `POST /api/v1/companies`: Creates a new target company.
    *   *Payload:* `{ "name": "...", "ticker": "...", "industry": "..." }`

### Analysis & Reporting (Upcoming API)
*   `POST /api/v1/analyses/upload`: Accepts a `multipart/form-data` CSV file upload linked to a `company_id` and `financial_year`.
*   `GET /api/v1/analyses/{id}`: Returns the computed Beneish M-Score, 8 sub-indicators, and AI anomaly flags.

---

## 4. Division of Labor (2 Developers)

To work efficiently in parallel, we recommend dividing the app into two core domains:

### Developer 1: Core Architecture & Company Management
**Focus:** Layouts, Navigation, and Company CRUD operations.
1.  **API Utility:** Create an API wrapper (e.g., `src/services/api.js`) that automatically attaches the `localStorage('finomaly_token')` to every request and handles 401 Unauthorized redirects.
2.  **Dashboard Page (`Dashboard.jsx`)**: Build the high-level overview showing total companies analyzed and recent reports.
3.  **Companies Page (`Companies.jsx`)**:
    *   Build a data table to list all target companies.
    *   Build a "New Company" modal/form with validation.
4.  **Layout Refinement (`Sidebar.jsx` & `Navbar.jsx`)**: Polish the navigation UI and add a "Logout" button that clears the token and redirects to `/login`.

### Developer 2: The Analysis Engine & Visualizations
**Focus:** The financial workflows, file uploading, and complex data visualization.
1.  **New Analysis Flow (`NewAnalysis.jsx`)**:
    *   Build a multi-step form or file dropzone for CSV ingestion.
    *   Handle loading states (analyzing CSVs can take a few seconds).
2.  **Analysis Report Page (`AnalysisReport.jsx`)**:
    *   **The M-Score Gauge**: Build a visual gauge chart showing if a company is an "Accomplished Manipulator" (M-Score > -1.78) or "Non-Manipulator".
    *   **Indicator Breakdown**: Render the 8 underlying variables (DSRI, GMI, AQI, SGI, DEPI, SGAI, LVGI, TATA) in a grid of scorecards.
    *   **AI Anomalies (`AnomalyList.jsx`)**: Build a timeline/list view to display specific accounting anomalies flagged by the AI.

---

## 5. Workflow Rules
1.  **Mock First**: Do not wait for the backend. Build your UI components using hardcoded JSON state. The backend team will notify you when an endpoint is live to hook up.
2.  **Error Handling**: Always account for empty states, loading spinners, and error toasts (e.g., "Invalid CSV format").
3.  **Branching**: Use Git feature branches (`feat/company-table`, `feat/upload-flow`) to avoid merge conflicts.

You have full ownership of the React codebase. Have fun building FinOmaly!


