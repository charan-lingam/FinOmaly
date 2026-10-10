# FinOmaly v0.1
### AI-Powered Financial Forensics & Anomaly Detection

**Version 0.1.0**

**FinOmaly** is a financial analysis application designed to identify suspicious patterns and potential irregularities in corporate financial statements. It helps investors, chartered accountants, auditors, and financial analysts screen companies more efficiently by automating financial ratio analysis, Beneish M-Score calculation, and anomaly detection.

This is the initial v0.1 milestone release, representing the project foundation, repository structure, and early architecture for the FinOmaly platform.

> **Note:** FinOmaly is a project under development. Features described here represent the intended functionality and may not yet be fully implemented.

## Problem Statement

Analyzing the financial health of multiple companies manually requires significant time and effort. Financial statements may contain unusual patterns, inconsistencies, or indicators associated with potential earnings manipulation that deserve further investigation.

FinOmaly aims to automate the preliminary analysis of corporate financial data, highlight suspicious financial patterns, and generate explainable findings to support informed financial review.

## Objectives

- Process corporate financial data from CSV and Excel files.
- Validate and organize financial statement data.
- Calculate the Beneish M-Score to screen for potential earnings manipulation.
- Detect additional financial anomalies and unusual financial trends.
- Present analysis results through an interactive dashboard.
- Generate reports highlighting risk indicators and supporting financial figures.
- Store company information, financial statements, and analysis results in a persistent database.

## Completed Features
- **Authentication & DB Setup:** Secure JWT login, Supabase integration, and SQLAlchemy ORM.
- **Company Management:** CRUD endpoints for tracking target organizations.
- **Financial Data Ingestion:** Full CSV intake pipeline with automated parsing and DB storage.

## Planned Features

- **Financial Data Upload:** Import company financial data using CSV and Excel files.
- **Beneish M-Score Analysis:** Calculate the score using the established eight-variable model.
- **Financial Anomaly Detection:** Identify unusual financial patterns using defined rules and analysis techniques.
- **Multi-Company Dashboard:** View and compare companies and their financial indicators.
- **Financial Visualizations:** Display historical trends, ratios, and analysis results.
- **Audit Reports:** Present flagged indicators and explanations for further investigation.
- **Persistent Storage:** Store company records, financial statements, and analysis history.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| UI Navigation | React Router DOM |
| API Communication | Axios |
| Charts | Recharts |
| Backend | Python, FastAPI |
| API Server | Uvicorn |
| Data Processing | Pandas, NumPy |
| Excel Processing | OpenPyXL |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| Database Hosting | Supabase |
| Database Migrations | Alembic |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git, GitHub |

## System Architecture

```text
                 User
                   |
                   v
          React + Vite Frontend
             (Vercel Hosting)
                   |
             REST API / HTTP
                   |
                   v
             FastAPI Backend
             (Render Hosting)
                   |
          +--------+---------+
          |                  |
          v                  v
   Financial Analysis    SQLAlchemy ORM
   Pandas / NumPy             |
          |                   v
          |          PostgreSQL Database
          |             (Supabase)
          |                   |
          +---------+---------+
                    |
                    v
          Analysis Results & Reports
                    |
                    v
              React Dashboard
```

## Project Structure

```text
finomaly/
â”œâ”€â”€ frontend/                 # React + Vite application
â”‚   â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ assets/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ types/
â”‚   â”‚   â”œâ”€â”€ App.jsx
â”‚   â”‚   â”œâ”€â”€ main.jsx
â”‚   â”‚   â””â”€â”€ index.css
â”‚   â”œâ”€â”€ .env.example
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ vite.config.js
â”‚
â”œâ”€â”€ backend/                  # FastAPI application
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”‚   â””â”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ core/
â”‚   â”‚   â”œâ”€â”€ db/
â”‚   â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”œâ”€â”€ schemas/
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â””â”€â”€ main.py
â”‚   â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ migrations/
â”‚   â”œâ”€â”€ requirements.txt
â”‚   â”œâ”€â”€ Dockerfile
â”‚   â””â”€â”€ .env.example
â”‚
â”œâ”€â”€ sample_data/
â”œâ”€â”€ docs/
â”œâ”€â”€ .gitignore
â”œâ”€â”€ README.md
â””â”€â”€ render.yaml
```

The structure represents the intended organization of the application. Files and directories may be added as implementation progresses.

## Prerequisites

Install the following tools before setting up the project:

- Python 3.11 or later
- Node.js and npm
- Git
- A GitHub account
- A Supabase PostgreSQL project for the hosted database

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/charan-lingam/FinOmaly.git
cd FinOmaly
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure the backend

Create a `.env` file in the `backend/` directory based on `.env.example`.

Configure the following values:

```dotenv
DATABASE_URL=<YOUR_POSTGRESQL_CONNECTION_STRING>
FRONTEND_URL=<YOUR_FRONTEND_URL>
```

Use the PostgreSQL connection details provided by Supabase. Keep actual credentials private and never commit `.env` files to GitHub.

### 4. Start the backend during development

From the `backend/` directory:

```bash
uvicorn app.main:app --reload
```

The development API will be available at `http://localhost:8000` when the application is running. FastAPI's interactive API documentation is available at `/docs`.

### 5. Set up the frontend

Open a separate terminal:

```bash
cd frontend
npm install
```

Create a `.env` file based on `frontend/.env.example`:

```dotenv
VITE_API_URL=<YOUR_BACKEND_API_URL>
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will display the URL provided by Vite.

**Development and evaluation:** Localhost is used only for development and testing. The final evaluation version must be deployed and accessible through public URLs.

## Deployment

FinOmaly is planned to use three independently hosted services.

| Service | Hosting platform | Configuration |
|---|---|---|
| React frontend | Vercel | Root directory: `frontend/` |
| FastAPI backend | Render | Root directory: `backend/` |
| PostgreSQL database | Supabase | Configure the connection string in Render |

### Deployment requirements

- Configure the production frontend URL in the backend's CORS settings.
- Configure the production backend URL in the frontend's environment variables.
- Store database credentials in the backend hosting platform's environment settings.
- Verify database connectivity and schema initialization or migrations.
- Test file uploads, financial calculations, saved results, and reports using the deployed application.

Public URLs should be added here after deployment is complete.

## Financial Analysis Disclaimer

The Beneish M-Score is a statistical screening model used to identify patterns associated with potential earnings manipulation. It is not proof of fraud and should not be treated as a standalone investment recommendation.

FinOmaly is intended to support preliminary financial analysis. Its findings require appropriate interpretation and, where necessary, further investigation by qualified professionals.

## Development Status

FinOmaly is under active development. The frontend, backend APIs, database integration, financial analysis services, and deployment configuration will be implemented and tested incrementally.

## License

No license has been selected yet. Add a license before distributing the project publicly.

