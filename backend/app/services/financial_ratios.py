"""
Financial Ratios Service
Computes forensic, liquidity, profitability, leverage, and efficiency ratios from canonical financial statements.
"""

from typing import Dict, Any, Optional, List
from app.services.beneish import safe_div


def compute_all_ratios(statement) -> Dict[str, Optional[float]]:
    """
    Computes standard financial ratios for a given financial statement.
    All floating point figures are rounded to 4 decimal places.
    """
    if not statement:
        return {}

    ratios: Dict[str, Optional[float]] = {}

    sales = getattr(statement, 'net_sales', None)
    cogs = getattr(statement, 'cogs', None)
    ar = getattr(statement, 'accounts_receivable', None)
    ca = getattr(statement, 'current_assets', None)
    ppe = getattr(statement, 'ppe', None)
    ta = getattr(statement, 'total_assets', None)
    dep = getattr(statement, 'depreciation', None)
    cl = getattr(statement, 'current_liabilities', None)
    ltd = getattr(statement, 'long_term_debt', None)
    tl = getattr(statement, 'total_liabilities', None)
    sga = getattr(statement, 'sga_expense', None)
    income = getattr(statement, 'income_continuing_operations', None)
    cfo = getattr(statement, 'cfo', None)

    # 1. Liquidity Ratios
    ratios['current_ratio'] = safe_div(ca, cl)
    # Quick Assets proxy = Current Assets - Accounts Receivable (or liquid proxy)
    ratios['quick_ratio'] = safe_div(ar, cl) if (ca is not None and cl is not None) else None
    ratios['working_capital'] = float(ca) - float(cl) if (ca is not None and cl is not None) else None

    # 2. Profitability Ratios
    if sales is not None and cogs is not None:
        gross_profit = float(sales) - float(cogs)
        ratios['gross_margin'] = safe_div(gross_profit, sales)
    else:
        ratios['gross_margin'] = None

    if sales is not None and cogs is not None and sga is not None:
        operating_profit = float(sales) - float(cogs) - float(sga)
        ratios['operating_margin'] = safe_div(operating_profit, sales)
    else:
        ratios['operating_margin'] = None

    ratios['net_margin'] = safe_div(income, sales)
    ratios['roa'] = safe_div(income, ta)
    ratios['cfo_margin'] = safe_div(cfo, sales)
    ratios['cash_return_on_assets'] = safe_div(cfo, ta)

    # 3. Leverage / Solvency Ratios
    ratios['debt_to_assets'] = safe_div(tl, ta)
    ratios['long_term_debt_ratio'] = safe_div(ltd, ta)
    if ta is not None and tl is not None:
        equity = float(ta) - float(tl)
        ratios['debt_to_equity'] = safe_div(tl, equity) if equity != 0 else None
    else:
        ratios['debt_to_equity'] = None

    # 4. Activity / Efficiency Ratios
    ratios['asset_turnover'] = safe_div(sales, ta)
    ratios['receivables_turnover'] = safe_div(sales, ar)
    if sales is not None and ar is not None and float(sales) != 0:
        ratios['days_sales_outstanding'] = round(365.0 * float(ar) / float(sales), 2)
    else:
        ratios['days_sales_outstanding'] = None

    # 5. Earnings Quality / Accruals Ratios
    if income is not None and cfo is not None and ta is not None:
        ratios['accruals_to_assets'] = safe_div(float(income) - float(cfo), ta)
    else:
        ratios['accruals_to_assets'] = None

    ratios['cfo_to_net_income'] = safe_div(cfo, income)

    # Round float values
    for k, v in ratios.items():
        if v is not None and isinstance(v, (float, int)):
            ratios[k] = round(float(v), 4)

    return ratios


def compute_ratio_growth(curr_stmt, prev_stmt) -> Dict[str, Optional[float]]:
    """
    Computes year-over-year percentage growth for core metrics and ratios.
    """
    curr_ratios = compute_all_ratios(curr_stmt)
    prev_ratios = compute_all_ratios(prev_stmt)

    growth: Dict[str, Optional[float]] = {}
    for metric, curr_val in curr_ratios.items():
        prev_val = prev_ratios.get(metric)
        if curr_val is not None and prev_val is not None and prev_val != 0:
            growth[f"{metric}_yoy_growth"] = round(((curr_val - prev_val) / abs(prev_val)) * 100, 2)
        else:
            growth[f"{metric}_yoy_growth"] = None

    return growth


def compute_multi_year_ratios(statements: List[Any]) -> List[Dict[str, Any]]:
    """
    Generates a historical time-series of ratios from a list of financial statements.
    """
    series = []
    for stmt in sorted(statements, key=lambda s: getattr(s, 'year', '')):
        ratios = compute_all_ratios(stmt)
        series.append({
            "year": getattr(stmt, 'year', 'Unknown'),
            "ratios": ratios
        })
    return series
