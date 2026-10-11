"""
Forensic Report Generator Service
Generates structured audit packages, executive summaries, and markdown reports.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.services.beneish import calculate_m_score
from app.services.anomaly_detector import detect_anomalies
from app.services.financial_ratios import compute_all_ratios


DISCLAIMER_TEXT = (
    "FinOmaly is a financial forensic screening support system. An elevated Beneish M-Score "
    "or flagged index indicates statistical anomaly and does not constitute conclusive evidence "
    "of fraud, manipulation, or legal wrongdoing. All findings require professional evaluation."
)


def generate_forensic_report(
    company_name: str,
    ticker: str,
    curr_stmt: Any,
    prev_stmt: Any,
    m_score_result: Optional[Dict[str, Any]] = None,
    anomalies: Optional[List[Dict[str, Any]]] = None,
    ratios: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Compiles a comprehensive forensic audit report object.
    """
    if not m_score_result:
        m_score_result = calculate_m_score(curr_stmt, prev_stmt)

    if anomalies is None:
        anomalies = detect_anomalies(curr_stmt, prev_stmt, m_score_result)

    if ratios is None and curr_stmt:
        ratios = compute_all_ratios(curr_stmt)

    m_score = m_score_result.get("m_score")
    is_manipulator = m_score_result.get("is_manipulator", False)

    risk_label = "HIGH RISK" if is_manipulator else "LOW RISK"
    if m_score is None:
        risk_label = "INCOMPLETE DATA"

    # Count flags
    flagged_indices = [
        k for k, v in m_score_result.items()
        if k not in ["m_score", "is_manipulator"] and v is not None and v > 1.0
    ]

    report = {
        "metadata": {
            "company_name": company_name,
            "ticker": ticker,
            "current_year": getattr(curr_stmt, 'year', 'Current'),
            "prior_year": getattr(prev_stmt, 'year', 'Prior'),
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "report_version": "1.0",
        },
        "executive_summary": {
            "m_score": m_score,
            "risk_rating": risk_label,
            "threshold": -1.78,
            "flagged_indicators_count": len(flagged_indices),
            "flagged_indicators": [f.upper() for f in flagged_indices],
            "anomalies_detected_count": len(anomalies),
            "verdict": (
                "Statistically significant indicators of earnings distortion detected. Further investigation recommended."
                if is_manipulator
                else "Financial metrics fall within expected historical variances. No acute manipulation flags identified."
            )
        },
        "beneish_indicators": m_score_result,
        "forensic_anomalies": anomalies,
        "financial_ratios": ratios,
        "recommended_audit_procedures": [a.get("suggested_review") for a in anomalies if a.get("suggested_review")],
        "disclaimer": DISCLAIMER_TEXT,
    }

    return report


def generate_markdown_report(report_data: Dict[str, Any]) -> str:
    """
    Renders the forensic report into a formatted GitHub-compatible Markdown document.
    """
    meta = report_data.get("metadata", {})
    summary = report_data.get("executive_summary", {})
    indicators = report_data.get("beneish_indicators", {})
    anomalies = report_data.get("forensic_anomalies", [])
    ratios = report_data.get("financial_ratios", {})

    lines = [
        f"# FinOmaly Forensic Audit Report: {meta.get('company_name', 'Company')} ({meta.get('ticker', 'TICKER')})",
        f"**Period:** {meta.get('prior_year')} -> {meta.get('current_year')} | **Generated:** {meta.get('generated_at')}",
        "",
        "## Executive Summary",
        f"- **Beneish M-Score:** `{summary.get('m_score', 'N/A')}` (Benchmark threshold: -1.78)",
        f"- **Risk Classification:** **{summary.get('risk_rating')}**",
        f"- **Flagged Indices:** {', '.join(summary.get('flagged_indicators', [])) or 'None'}",
        f"- **Total Anomalies:** {summary.get('anomalies_detected_count', 0)}",
        f"> {summary.get('verdict')}",
        "",
        "## Beneish M-Score Breakdown",
        "| Index | Symbol | Value | Benchmark | Status |",
        "| :--- | :--- | :--- | :--- | :--- |",
        f"| Days Sales in Receivables | DSRI | {indicators.get('dsri', 'N/A')} | 1.031 | {'FLAGGED' if (indicators.get('dsri') or 0) > 1 else 'Normal'} |",
        f"| Gross Margin Index | GMI | {indicators.get('gmi', 'N/A')} | 1.014 | {'FLAGGED' if (indicators.get('gmi') or 0) > 1 else 'Normal'} |",
        f"| Asset Quality Index | AQI | {indicators.get('aqi', 'N/A')} | 1.039 | {'FLAGGED' if (indicators.get('aqi') or 0) > 1 else 'Normal'} |",
        f"| Sales Growth Index | SGI | {indicators.get('sgi', 'N/A')} | 1.134 | {'FLAGGED' if (indicators.get('sgi') or 0) > 1 else 'Normal'} |",
        f"| Depreciation Index | DEPI | {indicators.get('depi', 'N/A')} | 1.001 | {'FLAGGED' if (indicators.get('depi') or 0) > 1 else 'Normal'} |",
        f"| SG&A Expenses Index | SGAI | {indicators.get('sgai', 'N/A')} | 1.054 | {'FLAGGED' if (indicators.get('sgai') or 0) > 1 else 'Normal'} |",
        f"| Leverage Index | LVGI | {indicators.get('lvgi', 'N/A')} | 1.037 | {'FLAGGED' if (indicators.get('lvgi') or 0) > 1 else 'Normal'} |",
        f"| Total Accruals to Assets | TATA | {indicators.get('tata', 'N/A')} | 0.031 | {'FLAGGED' if (indicators.get('tata') or 0) > 0.05 else 'Normal'} |",
        "",
        "## Forensic Anomaly Findings",
    ]

    if not anomalies:
        lines.append("No material anomalies flagged during screening.")
    else:
        for idx, a in enumerate(anomalies, 1):
            lines.append(f"### {idx}. [{a.get('severity', '').upper()}] {a.get('title')}")
            lines.append(f"- **Metric:** `{a.get('metric_flagged')}`")
            lines.append(f"- **Finding:** {a.get('description')}")
            if a.get('suggested_review'):
                lines.append(f"- **Audit Recommendation:** {a.get('suggested_review')}")
            lines.append("")

    if ratios:
        lines.extend([
            "## Key Financial Ratios",
            f"- **Current Ratio:** {ratios.get('current_ratio', 'N/A')}",
            f"- **Gross Margin:** {ratios.get('gross_margin', 'N/A')}",
            f"- **Operating Margin:** {ratios.get('operating_margin', 'N/A')}",
            f"- **Return on Assets (ROA):** {ratios.get('roa', 'N/A')}",
            f"- **Debt to Assets:** {ratios.get('debt_to_assets', 'N/A')}",
            f"- **Days Sales Outstanding (DSO):** {ratios.get('days_sales_outstanding', 'N/A')} days",
            "",
        ])

    lines.extend([
        "---",
        f"*{report_data.get('disclaimer', DISCLAIMER_TEXT)}*",
    ])

    return "\n".join(lines)
