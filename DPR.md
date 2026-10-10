# Finomaly — Detailed Project Requirements (DPR)

**Version:** V0.2  
**Status:** Initial scope / first implementation baseline  
**Project name:** Finomaly  
**Tagline:** AI-Powered Financial Forensics & Anomaly Detection

## 1. Project overview

Finomaly is a web-based financial statement analysis system for corporate finance and internal audit teams. It calculates the eight variables of the Beneish M-Score from raw financial statement figures, computes the standard M-Score, and flags unusual patterns through rule-based checks and historical trend analysis.

Finomaly is a screening and review-support tool. An elevated M-Score or an anomaly flag does not prove fraud or misconduct.

## 2. Objectives

- Calculate all eight Beneish variables from raw financial statement figures.
- Calculate the standard Beneish M-Score using its established coefficients.
- Identify additional anomalies through rule-based checks and company-specific historical trends.
- Provide explainable findings with relevant values, historical changes, reasons for flags, and suggested areas for human review.
- Support multiple organizations and multiple companies per organization with strict tenant isolation.
- Preserve analysis history for auditability.

## 3. Target users

Corporate finance teams and internal audit teams.

## 4. Functional requirements

### 4.1 Authentication and organization management

- Users must authenticate before accessing protected company data.
- Each organization can manage multiple companies.
- Each company has its own financial statements and analysis history.
- Users may access only organizations for which they are authorized.
- Organization-level isolation applies to API operations, database records, and uploaded files.
- The initial design uses shared PostgreSQL tables with organization-owned records, not dynamically created tables or a separate database instance for each company.

### 4.2 Financial statement uploads

Accept CSV and Excel files in either format:
1. One combined file containing required financial figures across multiple financial years.
2. Separate files for the income statement, balance sheet, and cash flow statement.

Requirements:
- Accept user-provided files only; no built-in sample dataset is in the initial product scope.
- Automatically detect financial years from uploaded columns or records and validate them.
- Normalize supported formats into a consistent internal representation.
- Validate required fields, numeric values, financial-year mappings, and consistency between statements.
- Reject invalid files with clear, actionable validation errors and require correction and re-upload.
- Valid files may be retained when the complete upload set is not yet ready, but analysis must remain blocked until required inputs and years are consistent.
- Explain missing statements, fields, or year mismatches.
- Support the same company’s financial data across multiple years.

### 4.3 Beneish M-Score calculation

Finomaly calculates the eight variables below from raw financial figures. Users are not required to provide pre-calculated indicators.

The model compares a **current financial year** \(t\) with the **immediately preceding financial year** \(t-1\). For example, analysing FY2025 requires the relevant inputs for both FY2025 and FY2024. The system must not assume that a financial year is a calendar year; it must use the financial-year labels detected and validated from the upload.

#### 4.3.1 Raw financial statement inputs

The backend must map the uploaded statement line items to the following inputs. Company spreadsheets may use different labels, so mapping must be validated rather than based only on a column name.

| Symbol | Required figure | Typical source | How it is used |
|---|---|---|---|
| \(S\) | Net sales / revenue | Income statement | Revenue denominator and sales growth |
| \(AR\) | Accounts receivable / trade receivables | Balance sheet or notes | Receivables relative to sales |
| \(COGS\) | Cost of goods sold / cost of revenue | Income statement | Gross profit and gross margin |
| \(CA\) | Total current assets | Balance sheet | Asset quality calculation |
| \(PPE\) | Net property, plant and equipment (net fixed assets) | Balance sheet or notes | Asset quality and depreciation calculations |
| \(TA\) | Total assets | Balance sheet | Asset quality, leverage, and accruals calculations |
| \(Dep\) | Depreciation expense for the year | Income statement, cash flow statement, or notes | Depreciation index |
| \(SG\&A\) | Selling, general and administrative expenses | Income statement or expense notes | SG&A as a proportion of sales |
| \(TL\) | Total liabilities | Balance sheet | Leverage calculation |
| \(ICO\) | Income from continuing operations | Income statement | Total accruals calculation |
| \(CFO\) | Net cash flow from operating activities | Cash flow statement | Total accruals calculation |

**Year requirements:** Every variable that compares years needs the applicable inputs for both \(t\) and \(t-1\). TATA uses current-year income from continuing operations, operating cash flow, and total assets. In practice, the upload validation must ensure the data needed for all eight variables is available and consistently mapped before the final score is calculated.

**Accounting mapping requirements:**
- Use the same units and compatible accounting definitions across both years.
- Distinguish net PPE from gross PPE and depreciation expense from accumulated depreciation.
- Do not substitute an unrelated expense or asset category when a required line item is absent.
- If a required value cannot be mapped confidently, ask the user to correct the file or report a validation error.
- Missing data must not be silently replaced with zero.
- If a denominator is zero or a formula is undefined, mark the calculation unavailable and explain why.

#### 4.3.2 DSRI — Days' Sales in Receivables Index

**Raw figures required for both years:** accounts receivable \(AR\) and net sales \(S\).

First calculate receivables as a proportion of sales for each year:
\[
ReceivablesRatio_t = \frac{AR_t}{S_t}
\]

Then compare the prior year with the current year:
\[
DSRI_t = \frac{AR_t/S_t}{AR_{t-1}/S_{t-1}}
\]

**Interpretation:** Measures whether receivables have increased or decreased relative to sales.

#### 4.3.3 GMI — Gross Margin Index

**Raw figures required for both years:** net sales \(S\) and cost of goods sold \(COGS\).

First calculate gross profit:
\[
GrossProfit_t = S_t - COGS_t
\]

Then calculate gross margin:
\[
GM_t = \frac{S_t - COGS_t}{S_t}
\]

Finally:
\[
GMI_t = \frac{GM_{t-1}}{GM_t}
\]

**Interpretation:** Compares the prior-year gross margin with the current-year gross margin.

#### 4.3.4 AQI — Asset Quality Index

**Raw figures required for both years:** total current assets \(CA\), net property, plant and equipment \(PPE\), and total assets \(TA\).

First calculate the portion of assets not represented by current assets and net PPE:
\[
AssetQualityComponent_t =
\frac{TA_t - CA_t - PPE_t}{TA_t}
\]

Then compare the two years:
\[
AQI_t =
\frac{1-(CA_t+PPE_t)/TA_t}
{1-(CA_{t-1}+PPE_{t-1})/TA_{t-1}}
\]

**Interpretation:** Tracks changes in the proportion of assets outside current assets and net PPE. The mapping must use the model's specified accounting definitions consistently.

#### 4.3.5 SGI — Sales Growth Index

**Raw figures required for both years:** net sales \(S\).

\[
SGI_t = \frac{S_t}{S_{t-1}}
\]

**Interpretation:** Compares current-year sales with prior-year sales.

#### 4.3.6 DEPI — Depreciation Index

**Raw figures required for both years:** depreciation expense \(Dep\) and net property, plant and equipment \(PPE\).

First calculate the depreciation rate component for each year:
\[
DepRate_t = \frac{Dep_t}{Dep_t + PPE_t}
\]

Then compare the rates:
\[
DEPI_t =
\frac{Dep_{t-1}/(Dep_{t-1}+PPE_{t-1})}
{Dep_t/(Dep_t+PPE_t)}
\]

**Interpretation:** Compares the depreciation-rate component between years. The implementation must use consistent definitions for depreciation expense and net PPE.

#### 4.3.7 SGAI — SG&A Expense Index

**Raw figures required for both years:** selling, general and administrative expenses \(SG\&A\) and net sales \(S\).

First calculate SG&A expenses as a proportion of sales:
\[
SGARatio_t = \frac{SG\&A_t}{S_t}
\]

Then compare years:
\[
SGAI_t =
\frac{SG\&A_t/S_t}
{SG\&A_{t-1}/S_{t-1}}
\]

**Interpretation:** Measures the change in SG&A expenses relative to sales.

#### 4.3.8 LVGI — Leverage Index

**Raw figures required for both years:** total liabilities \(TL\) and total assets \(TA\).

First calculate leverage:
\[
Leverage_t = \frac{TL_t}{TA_t}
\]

Then compare years:
\[
LVGI_t =
\frac{TL_t/TA_t}
{TL_{t-1}/TA_{t-1}}
\]

**Interpretation:** Compares the liabilities-to-assets ratio across years.

#### 4.3.9 TATA — Total Accruals to Total Assets

**Raw figures required for the current year:** income from continuing operations \(ICO\), net cash flow from operating activities \(CFO\), and total assets \(TA\).

\[
TATA_t = \frac{ICO_t - CFO_t}{TA_t}
\]

**Interpretation:** Scales the difference between income from continuing operations and operating cash flow by total assets.

### 4.4 Standard Beneish M-Score formula

Once all eight variables have been calculated successfully:

\[
\begin{aligned}
M ={}& -4.84 + 0.920(DSRI) + 0.528(GMI)\\
&+ 0.404(AQI) + 0.892(SGI)\\
&+ 0.115(DEPI) - 0.172(SGAI)\\
&+ 4.679(TATA) - 0.327(LVGI)
\end{aligned}
\]

The backend must apply the coefficients and intercept exactly as shown for the standard eight-variable model.

**Calculation and validation rules:**
- Use the current year and immediately preceding financial year where the indicator requires a year-over-year comparison.
- Require all eight valid indicators before producing the standard M-Score.
- If an input is missing, invalid, ambiguously mapped, or causes a zero/undefined denominator, do not return a standard M-Score. Explain which input or calculation failed.
- Never silently replace missing values with zero.
- Validate units, signs, financial-year labels, and line-item mappings consistently.
- Display the raw inputs used, calculated indicator values, and calculation explanations in the analysis results.
- The commonly used \(-1.78\) threshold may be shown as a screening reference. It must not be presented as proof of manipulation or fraud.

### 4.5 Anomaly detection

The initial release uses:
- Beneish M-Score analysis.
- Rule-based anomaly checks.
- Historical trend analysis across the same company’s available financial years.

Cross-company statistical comparison is outside the initial scope. Findings should show, where applicable:
- Flagged metric or indicator.
- Relevant financial values.
- Historical change.
- Reason for the flag.
- Suggested area for human review.

### 4.6 Analysis history

- Every analysis run creates a new analysis record.
- Re-running an analysis must not overwrite previous results.
- Each run must be associated with the relevant company and the financial data version used.
- Preserve historical scores, indicator values, and anomaly findings.
- Analysis history must remain isolated by organization.

### 4.7 Dashboard and results

The interactive dashboard will show:
- Company overview and analysis history.
- Beneish indicator values and final M-Score.
- Anomaly findings and explanations.
- Historical financial trends within the same company.
- Validation errors and missing-input information where applicable.

PDF report downloads are outside V0.1 scope.

## 5. Data storage, retention, and deletion

### Database
Supabase PostgreSQL stores structured records, including users, organizations, memberships, companies, financial statement metadata, normalized figures, analysis runs, indicator values, findings, and references to original files.

### Original files
Supabase Storage with private buckets stores original CSV and Excel uploads. Access must be authorized through organization ownership checks. Public access to financial files is not permitted.

### Deletion
Authorized users can delete an analysis or company and associated files, normalized data, and results, subject to authorization and referential integrity. The implementation must handle failures across PostgreSQL and Storage so inconsistencies or orphaned files are detected and recoverable.

## 6. Non-functional requirements

### Security
- Authentication and organization-level authorization are required.
- Prevent access through guessed or manipulated record IDs.
- Apply ownership checks to relevant API operations.
- Use private storage and appropriate database access controls.
- Keep database credentials and secrets in backend environment variables.
- Never expose server secrets through frontend environment variables.
- PostgreSQL Row-Level Security is recommended as an additional safeguard, subject to the chosen authentication design.

### Reliability and integrity
- Reject invalid financial inputs.
- Do not calculate the M-Score from incomplete required inputs.
- Preserve historical analysis results.
- Validate financial-year consistency across separate uploads.
- Maintain referential integrity among organizations, companies, statements, and analyses.

### Explainability
- Show the inputs used in calculations.
- Display all eight calculated variables.
- Explain why findings were flagged.
- Distinguish screening indicators from confirmed misconduct.

## 7. Technology stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Python, FastAPI, Uvicorn |
| Database | Supabase PostgreSQL |
| ORM | SQLAlchemy |
| PostgreSQL driver | psycopg |
| Data processing | Pandas, NumPy |
| Excel parsing | OpenPyXL |
| Validation/configuration | Pydantic Settings |
| Migrations | Alembic |
| File uploads | python-multipart |
| Charts | Recharts |
| Routing | React Router |
| HTTP client | Axios |
| Icons | Lucide React |
| Frontend deployment | Vercel |
| Backend deployment | Render |
| Original file storage | Supabase Storage |

## 8. High-level architecture

1. User authenticates and selects a company.
2. User uploads a combined file or separate financial statements.
3. FastAPI receives and validates the uploads.
4. The backend detects financial years, maps raw figures, and checks required inputs.
5. Original files are retained in private Supabase Storage; normalized data and metadata are stored in PostgreSQL.
6. The calculation service computes the eight Beneish variables.
7. The scoring service computes the standard M-Score only when all variables are valid.
8. The anomaly service runs rule-based and historical-trend checks.
9. A new analysis run and its findings are stored.
10. The frontend displays results and history.

## 9. Initial database entities

Proposed entities:
- `users`
- `organizations`
- `organization_memberships`
- `companies`
- `financial_statements`
- `uploaded_files`
- `analyses`
- `beneish_indicators`
- `anomaly_findings`

This is a proposed entity list, not a finalized schema. Foreign keys, unique constraints, organization ownership, and deletion behavior must be designed before implementation. Use shared tables with organization-owned records rather than dynamically creating tables per company.

## 10. Deployment requirements

The application must be publicly accessible for evaluation:
- Frontend: Vercel.
- Backend: Render.
- Structured data: Supabase PostgreSQL.
- Original uploads: private Supabase Storage buckets.
- Configure production environment variables and frontend-to-backend CORS.
- Verify the deployed system end-to-end; localhost alone does not satisfy deployment requirements.

## 11. Out of scope for V0.1

- Custom metrics, user-defined formulas, or custom indicator sets.
- Transaction-level ledger analysis.
- ERP integrations or external financial-data ingestion.
- Built-in sample datasets.
- PDF report downloads.
- Cross-company statistical anomaly comparisons.
- Separate database instances or dynamically created tables for each company.

## 12. Acceptance criteria

V0.1 is functionally complete when:
1. Users can authenticate and access only authorized organizations.
2. An organization can manage multiple companies with isolated data.
3. Users can upload combined or separate CSV/Excel statements.
4. The backend detects and validates financial years and required fields.
5. Invalid uploads produce clear errors; inconsistent upload sets cannot be analyzed.
6. The backend calculates all eight Beneish variables from raw figures using the formulas in this document.
7. The standard M-Score is calculated only when all eight variables are available and valid.
8. Rule-based and historical-trend checks provide explainable findings.
9. Every re-run creates a new analysis record and preserves prior results.
10. Original files and structured results are retained and can be deleted through authorized operations.
11. The deployed frontend and backend work together without relying on localhost.
12. The application states that M-Scores and anomaly flags do not prove fraud.

## 13. Disclaimer

Finomaly is a financial screening and forensic-support tool. Outputs identify patterns that may warrant further review. An elevated Beneish M-Score or anomaly flag does not establish fraud, manipulation, intent, or legal wrongdoing. Findings require appropriate human and professional evaluation.

## 14. Future enhancements

Possible future versions may include organization-specific metric selection, custom formulas, additional anomaly-detection methods, downloadable reports, and external financial-system integrations. These are not included in V0.1.
