## Tech Stack & Dependencies

### 1. Frontend

| Technology / Package | Purpose |
|---|---|
| React | Build the user interface |
| Vite | Frontend development and build tool |
| Axios | HTTP requests to the backend API |
| React Router DOM | Client-side navigation |
| Recharts | Financial charts and visualizations |
| Lucide React | UI icons |

**Runtime:** Node.js and npm

### 2. Backend

| Package | Purpose |
|---|---|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| SQLAlchemy | Database ORM and queries |
| Psycopg | PostgreSQL database driver |
| Pydantic Settings | Environment-based configuration |
| Pandas | Financial data processing |
| NumPy | Numerical computations |
| OpenPyXL | Excel file processing |
| Python Multipart | File uploads |
| Alembic | Database schema migrations |

**Runtime:** Python 3.11+

### 3. Database

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database |
| Supabase | Managed PostgreSQL hosting |

### 4. Deployment & Infrastructure

| Platform / Tool | Purpose |
|---|---|
| Vercel | React frontend hosting |
| Render | FastAPI backend hosting |
| Git | Version control |
| GitHub | Source code repository |

### 5. Financial Analysis

| Library / Component | Purpose |
|---|---|
| Pandas | Load and process financial statements |
| NumPy | Calculate financial ratios |
| Custom Python modules | Beneish M-Score calculation and financial anomaly detection |

### 6. Configuration

- Environment variables for database credentials and API URLs.
- `.env.example` files to document required configuration.
- CORS configuration to allow requests from the deployed frontend.
- Alembic migrations to manage database schema changes.

### 7. Testing (planned)

| Package | Purpose |
|---|---|
| Pytest | Backend unit and integration tests |
| HTTPX | Test FastAPI endpoints |

### 8. Core Features

- Financial statement CSV and Excel uploads.
- Financial data validation and processing.
- Beneish M-Score calculation.
- Financial anomaly detection.
- Multi-company analysis dashboard.
- Financial trend charts and audit reports.
- Persistent storage of company data and analysis results.