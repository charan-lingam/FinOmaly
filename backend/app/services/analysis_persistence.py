"""
Analysis Persistence Service
Handles calculating, persisting, and synchronizing AnalysisRun, BeneishIndicator, 
and AnomalyFinding records in the database.
"""

from typing import List, Optional, Dict, Any
import uuid
import math
from decimal import Decimal, InvalidOperation
from sqlalchemy.orm import Session

from app.models.analysis import AnalysisRun, BeneishIndicator, AnomalyFinding
from app.models.financial import FinancialStatement
from app.services.beneish import calculate_m_score
from app.services.anomaly_detector import detect_anomalies

INDICATOR_SPECS = [
    ("DSRI", "Days' Sales in Receivables Index", "dsri", Decimal("0.920")),
    ("GMI",  "Gross Margin Index",                "gmi",  Decimal("0.528")),
    ("AQI",  "Asset Quality Index",               "aqi",  Decimal("0.404")),
    ("SGI",  "Sales Growth Index",                "sgi",  Decimal("0.892")),
    ("DEPI", "Depreciation Index",                "depi", Decimal("0.115")),
    ("SGAI", "SG&A Expense Index",               "sgai", Decimal("-0.172")),
    ("LVGI", "Leverage Index",                    "lvgi", Decimal("-0.327")),
    ("TATA", "Total Accruals to Total Assets",    "tata", Decimal("4.679")),
]


def to_decimal(val: Any) -> Optional[Decimal]:
    """Safely converts numeric value to Decimal(10, 4) within valid database bounds."""
    if val is None:
        return None
    try:
        val_f = float(val)
        if math.isnan(val_f) or math.isinf(val_f):
            return None
        # Clamp to Numeric(10, 4) bounds (-999999.9999 to 999999.9999)
        if abs(val_f) > 999999.9999:
            val_f = 999999.9999 if val_f > 0 else -999999.9999
        return Decimal(f"{val_f:.4f}")
    except (ValueError, TypeError, InvalidOperation):
        return None


def sync_company_analyses(db: Session, company_id: uuid.UUID) -> List[AnalysisRun]:
    """
    Computes and stores Beneish indicators, M-Scores, and anomaly findings in the database
    for all consecutive financial statements of the company.
    """
    raw_statements = (
        db.query(FinancialStatement)
        .filter(FinancialStatement.company_id == company_id)
        .order_by(FinancialStatement.year.desc(), FinancialStatement.created_at.desc())
        .all()
    )

    statements = []
    seen_years = set()
    for s in raw_statements:
        if s.year not in seen_years:
            statements.append(s)
            seen_years.add(s.year)

    if len(statements) < 2:
        return []

    analysis_runs: List[AnalysisRun] = []

    # Calculate and store for each consecutive pair
    for i in range(len(statements) - 1):
        curr = statements[i]
        prev = statements[i + 1]

        m_dict = calculate_m_score(curr, prev)
        anomaly_findings = detect_anomalies(curr, prev, m_dict)

        m_score = m_dict.get("m_score")
        m_score_dec = to_decimal(m_score)
        is_manip = m_dict.get("is_manipulator")
        risk_level = "High" if is_manip else ("Low" if is_manip is False else "Incomplete")

        # Check if AnalysisRun already exists
        run = (
            db.query(AnalysisRun)
            .filter(
                AnalysisRun.company_id == company_id,
                AnalysisRun.target_statement_id == curr.id,
                AnalysisRun.prior_statement_id == prev.id,
            )
            .first()
        )

        if not run:
            run = AnalysisRun(
                company_id=company_id,
                target_statement_id=curr.id,
                prior_statement_id=prev.id,
                m_score=m_score_dec,
                risk_level=risk_level,
            )
            db.add(run)
            db.flush()  # assign run.id
        else:
            run.m_score = m_score_dec
            run.risk_level = risk_level

        # Persist Beneish Indicators
        existing_indicators = {ind.symbol: ind for ind in run.indicators}
        for symbol, name, key, coeff in INDICATOR_SPECS:
            val = m_dict.get(key)
            val_dec = to_decimal(val)
            contrib_dec = to_decimal(val * float(coeff)) if val is not None else None

            if symbol in existing_indicators:
                ind = existing_indicators[symbol]
                ind.value = val_dec
                ind.contribution = contrib_dec
                ind.name = name
                ind.coefficient = coeff
            else:
                new_ind = BeneishIndicator(
                    analysis_id=run.id,
                    symbol=symbol,
                    name=name,
                    value=val_dec,
                    coefficient=coeff,
                    contribution=contrib_dec,
                )
                db.add(new_ind)

        # Persist Anomaly Findings
        # Delete existing findings for this run to avoid duplicates on re-analysis
        for existing_f in list(run.findings):
            db.delete(existing_f)

        for f in anomaly_findings:
            finding = AnomalyFinding(
                analysis_id=run.id,
                severity=str(f.get("severity", "medium"))[:20],
                metric_flagged=str(f.get("metric_flagged", ""))[:50],
                title=str(f.get("title", ""))[:255],
                description=str(f.get("description", "")),
                suggested_review=str(f.get("suggested_review", "")) if f.get("suggested_review") else None,
            )
            db.add(finding)

        analysis_runs.append(run)

    db.commit()

    for run in analysis_runs:
        db.refresh(run)

    return analysis_runs

