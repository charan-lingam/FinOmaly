"""
Forensic Anomaly Detector Service
Implements rules-based and statistical anomaly detection for financial statements and Beneish M-Score components.
"""

from typing import List, Dict, Any, Optional
import math
from app.services.beneish import safe_div, calculate_m_score


# Standard forensic thresholds based on Beneish (1999) empirical benchmarks
BENCHMARKS = {
    "dsri": {"threshold": 1.031, "name": "Days' Sales in Receivables Index", "risk_direction": "above", "severity": "high"},
    "gmi":  {"threshold": 1.014, "name": "Gross Margin Index", "risk_direction": "above", "severity": "medium"},
    "aqi":  {"threshold": 1.039, "name": "Asset Quality Index", "risk_direction": "above", "severity": "high"},
    "sgi":  {"threshold": 1.134, "name": "Sales Growth Index", "risk_direction": "above", "severity": "medium"},
    "depi": {"threshold": 1.001, "name": "Depreciation Index", "risk_direction": "above", "severity": "medium"},
    "sgai": {"threshold": 1.054, "name": "SG&A Expense Index", "risk_direction": "above", "severity": "low"},
    "lvgi": {"threshold": 1.037, "name": "Leverage Index", "risk_direction": "above", "severity": "medium"},
    "tata": {"threshold": 0.031, "name": "Total Accruals to Total Assets", "risk_direction": "above", "severity": "high"},
}


def detect_anomalies(curr, prev, m_score_dict: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Examines consecutive financial statements and returns detailed forensic anomaly findings.
    """
    findings = []
    
    if not curr or not prev:
        return findings

    # Calculate Beneish indices if not provided
    if not m_score_dict:
        m_score_dict = calculate_m_score(curr, prev)

    # 1. Analyze Beneish Indicators
    for metric, config in BENCHMARKS.items():
        val = m_score_dict.get(metric)
        if val is None:
            continue

        threshold = config["threshold"]
        flagged = (val > threshold) if config["risk_direction"] == "above" else (val < threshold)

        if flagged:
            title = f"Elevated {config['name']} ({metric.upper()})"
            description = (
                f"{config['name']} is {val:.4f}, exceeding benchmark threshold of {threshold:.4f}. "
            )
            suggested_review = ""

            if metric == "dsri":
                description += "Accounts receivable is growing disproportionately faster than revenues."
                suggested_review = "Verify revenue recognition timing, check for channel stuffing, and audit unbilled receivables."
            elif metric == "gmi":
                description += "Gross margins deteriorated relative to prior year, indicating pricing pressure or inventory write-downs."
                suggested_review = "Examine cost allocation, inventory valuation changes, and supplier contractual terms."
            elif metric == "aqi":
                description += "Proportion of non-current intangible assets and deferred charges increased significantly."
                suggested_review = "Audit capitalized software, goodwill impairments, and long-term asset capitalization policies."
            elif metric == "sgi":
                description += "Sales growth is unusually rapid, increasing operational pressure to sustain historical margins."
                suggested_review = "Sample sales contracts near quarter-ends and check bill-and-hold transactions."
            elif metric == "depi":
                description += "Depreciation rate declined, indicating extension of useful asset lives or revised salvage values."
                suggested_review = "Inspect fixed-asset schedules and depreciation policy modifications."
            elif metric == "sgai":
                description += "Sales, general, and administrative expenses outpaced revenue growth, impacting operational leverage."
                suggested_review = "Audit executive compensation, marketing accruals, and recurring overhead expenses."
            elif metric == "lvgi":
                description += "Total liabilities increased relative to asset base, heightening financial risk."
                suggested_review = "Verify debt covenants, short-term refinancing capabilities, and off-balance-sheet commitments."
            elif metric == "tata":
                description += "Net accounting income significantly outstrips actual cash generated from operations."
                suggested_review = "Reconcile net income to cash flow from operations line-by-line; inspect non-cash working capital."

            findings.append({
                "severity": config["severity"],
                "metric_flagged": metric.upper(),
                "title": title,
                "description": description,
                "suggested_review": suggested_review,
                "value": val,
                "threshold": threshold,
            })

    # 2. Operating Cash Flow vs Net Income Divergence
    curr_inc = getattr(curr, 'income_continuing_operations', None)
    curr_cfo = getattr(curr, 'cfo', None)
    if curr_inc is not None and curr_cfo is not None:
        curr_inc_f = float(curr_inc)
        curr_cfo_f = float(curr_cfo)
        if curr_inc_f > 0 and curr_cfo_f < 0:
            findings.append({
                "severity": "high",
                "metric_flagged": "CFO_DIVERGENCE",
                "title": "Positive Net Income with Negative Operating Cash Flow",
                "description": (
                    f"Reported operating income is ${curr_inc_f:,.2f} while cash flow from operations is negative "
                    f"at ${curr_cfo_f:,.2f}. This is a primary red flag for aggressive accruals."
                ),
                "suggested_review": "Inspect working capital accruals, timing of collections, and non-operating revenue additions.",
                "value": round(curr_cfo_f - curr_inc_f, 2),
                "threshold": 0.0,
            })

    # 3. Working Capital Deterioration Anomaly
    curr_ca = getattr(curr, 'current_assets', None)
    curr_cl = getattr(curr, 'current_liabilities', None)
    prev_ca = getattr(prev, 'current_assets', None)
    prev_cl = getattr(prev, 'current_liabilities', None)

    if curr_ca is not None and curr_cl is not None and prev_ca is not None and prev_cl is not None:
        curr_wc = float(curr_ca) - float(curr_cl)
        prev_wc = float(prev_ca) - float(prev_cl)
        if prev_wc > 0 and curr_wc < 0:
            findings.append({
                "severity": "medium",
                "metric_flagged": "WORKING_CAPITAL_INVERSION",
                "title": "Working Capital Deficit Inversion",
                "description": (
                    f"Working capital turned negative (Prior: ${prev_wc:,.2f} -> Current: ${curr_wc:,.2f}), "
                    "indicating short-term liquidity contraction."
                ),
                "suggested_review": "Analyze debt maturities within the next 12 months and supplier payables aging.",
                "value": round(curr_wc, 2),
                "threshold": 0.0,
            })

    # 4. Overall M-Score Manipulation Threshold Check
    m_score = m_score_dict.get("m_score")
    if m_score is not None and m_score > -1.78:
        findings.insert(0, {
            "severity": "critical",
            "metric_flagged": "M_SCORE",
            "title": "High Probability of Financial Statement Manipulation",
            "description": (
                f"Overall Beneish M-Score is {m_score:.4f}, which exceeds the critical -1.78 threshold. "
                "Statistically significant probability of earnings distortion."
            ),
            "suggested_review": "Initiate comprehensive forensic audit across revenue recognition, inventory, and capitalized expenditures.",
            "value": m_score,
            "threshold": -1.78,
        })

    return findings


def check_benford_law(numbers: List[float]) -> Dict[str, Any]:
    """
    Performs Benford's Law first-digit statistical test on a list of reported financial figures.
    """
    digits = []
    for n in numbers:
        if n and n != 0:
            first_digit = int(str(abs(n)).lstrip('0.0')[0])
            if 1 <= first_digit <= 9:
                digits.append(first_digit)

    if len(digits) < 10:
        return {"status": "insufficient_data", "count": len(digits)}

    total = len(digits)
    observed = {d: digits.count(d) / total for d in range(1, 10)}
    expected = {d: math.log10(1 + 1 / d) for d in range(1, 10)}

    # Chi-square goodness-of-fit statistic
    chi_square = sum(
        ((observed[d] - expected[d]) ** 2) / expected[d]
        for d in range(1, 10)
    ) * total

    p_anomaly = chi_square > 15.51  # approx 0.05 p-value with 8 degrees of freedom

    return {
        "status": "anomaly_detected" if p_anomaly else "conforming",
        "sample_size": total,
        "chi_square_stat": round(chi_square, 4),
        "observed_distribution": {d: round(v, 4) for d, v in observed.items()},
        "expected_distribution": {d: round(v, 4) for d, v in expected.items()},
        "is_anomalous": p_anomaly
    }

