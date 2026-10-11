import pytest
from app.services.beneish import safe_div, calculate_m_score


class MockStatement:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


def test_safe_div():
    assert safe_div(10, 2) == 5.0
    assert safe_div(10, 0) is None
    assert safe_div(None, 2) is None
    assert safe_div(10, None) is None
    assert safe_div(0, 5) == 0.0


def test_calculate_m_score_empty_or_none():
    res = calculate_m_score(None, None)
    assert res["m_score"] is None
    assert res["is_manipulator"] is None

    stmt = MockStatement()
    res2 = calculate_m_score(stmt, None)
    assert res2["m_score"] is None


def test_calculate_m_score_healthy_company():
    # A stable, non-manipulating company with balanced metrics
    prev = MockStatement(
        net_sales=1000000,
        cogs=600000,
        accounts_receivable=100000,
        current_assets=400000,
        ppe=500000,
        total_assets=1000000,
        depreciation=50000,
        current_liabilities=200000,
        long_term_debt=200000,
        total_liabilities=400000,
        sga_expense=150000,
        income_continuing_operations=100000,
        cfo=120000,
    )

    curr = MockStatement(
        net_sales=1050000,
        cogs=630000,
        accounts_receivable=105000,
        current_assets=420000,
        ppe=510000,
        total_assets=1050000,
        depreciation=52000,
        current_liabilities=210000,
        long_term_debt=190000,
        total_liabilities=400000,
        sga_expense=155000,
        income_continuing_operations=110000,
        cfo=130000,
    )

    result = calculate_m_score(curr, prev)

    assert result["dsri"] is not None
    assert result["gmi"] is not None
    assert result["aqi"] is not None
    assert result["sgi"] is not None
    assert result["depi"] is not None
    assert result["sgai"] is not None
    assert result["lvgi"] is not None
    assert result["tata"] is not None
    assert result["m_score"] is not None
    # For a stable company, M-score should be safely below -1.78
    assert result["m_score"] < -1.78
    assert result["is_manipulator"] is False


def test_calculate_m_score_manipulator_profile():
    # A profile with aggressive revenue recognition and deteriorating margins
    prev = MockStatement(
        net_sales=1000000,
        cogs=500000,
        accounts_receivable=100000,
        current_assets=300000,
        ppe=400000,
        total_assets=1000000,
        depreciation=60000,
        current_liabilities=200000,
        long_term_debt=200000,
        total_liabilities=400000,
        sga_expense=100000,
        income_continuing_operations=200000,
        cfo=200000,
    )

    curr = MockStatement(
        net_sales=1800000,  # Huge sales growth
        cogs=1200000,       # Margins collapsed
        accounts_receivable=500000, # Massive receivables jump (DSRI >> 1)
        current_assets=700000,
        ppe=450000,
        total_assets=1800000,
        depreciation=30000, # Halved depreciation (DEPI >> 1)
        current_liabilities=500000,
        long_term_debt=600000,
        total_liabilities=1100000,
        sga_expense=300000,
        income_continuing_operations=300000,
        cfo=-100000,       # Negative cash flow with positive income (High TATA)
    )

    result = calculate_m_score(curr, prev)
    assert result["m_score"] is not None
    assert result["m_score"] > -1.78
    assert result["is_manipulator"] is True

