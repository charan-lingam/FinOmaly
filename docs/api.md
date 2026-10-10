# FinOmaly API Contract (V0.3)

This document defines the exact HTTP routes and JSON data structures moving between the React Frontend and FastAPI Backend. All routes are prefixed with `/api/v1`.

---

## 1. Company Management

### Create Company
**`POST /companies`**
When the user clicks "Add Company".
```json
{
  "name": "Apex Industries Ltd",
  "industry": "Manufacturing",
  "ticker": "APEX" // Optional
}
```

### Company List / Summary
**`GET /companies`**
Populates the Dashboard and Companies list. The frontend needs the latest M-Score to show the risk badges.
```json
[
  {
    "id": "uuid-1234",
    "name": "Apex Industries Ltd",
    "industry": "Manufacturing",
    "analysis_count": 5,
    "latest_analysis": {
      "id": "uuid-9999",
      "year": "FY2024",
      "m_score": -1.43,
      "risk_level": "High"
    },
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

---

## 2. File Upload & Validation Flow

### Upload Files
**`POST /upload`**
Sent as `multipart/form-data`.
- `company_id`: "uuid-1234"
- `files`: [file binary data] (Supports 1 combined file, or up to 3 separate IS, BS, CF files)

### Validation Result (Response from Upload)
**Crucial Step:** Before running the M-Score, the frontend needs to know if the backend successfully mapped the variables. This powers the "Required Financial Inputs" table on the New Analysis page.

```json
{
  "status": "ready", // or "missing_data"
  "detected_years": ["FY2023", "FY2024"],
  "validation_summary": {
    "FY2024": [
      {
        "symbol": "S",
        "name": "Net Sales / Revenue",
        "found": true,
        "mapped_from_row": "Total Revenue",
        "value": 1500000
      },
      {
        "symbol": "AR",
        "name": "Accounts Receivable",
        "found": false,
        "error": "Could not find AR in Balance Sheet",
        "value": null
      }
      // ... remaining variables
    ]
  }
}
```

---

## 3. Analysis Execution & Reporting

### Run Analysis
**`POST /analyses`**
Once validation is "ready", the user clicks "Run Analysis".
```json
{
  "company_id": "uuid-1234",
  "target_year": "FY2024",
  "prior_year": "FY2023"
}
```

### Full Analysis Report
**`GET /analyses/{id}`**
This single payload powers the entire `/analysis/report` page, including the SVG Gauge, the Recharts Bar Chart, and the Anomaly Findings section.

```json
{
  "id": "uuid-9999",
  "company_id": "uuid-1234",
  "company_name": "Apex Industries Ltd",
  "run_info": {
    "target_year": "FY2024",
    "prior_year": "FY2023",
    "run_date": "2024-10-10T15:30:00Z"
  },
  "m_score_result": {
    "score": -1.43,
    "threshold": -1.78,
    "risk_level": "High"
  },
  "beneish_indicators": [
    {
      "symbol": "DSRI",
      "name": "Days' Sales in Receivables Index",
      "value": 1.45,
      "coefficient": 0.920,
      "contribution": 1.334
    }
    // ... all 8 indicators
  ],
  "anomaly_findings": [
    {
      "id": "anom-1",
      "severity": "high",
      "metric_flagged": "DSRI",
      "title": "Unusual jump in receivables",
      "description": "Accounts receivable grew by 45% while sales only grew by 10%.",
      "suggested_review": "Check for aggressive revenue recognition or channel stuffing at year-end."
    }
  ]
}
```
