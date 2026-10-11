import pytest
from app.services.anomaly_detector import detect_anomalies, check_benford_law
from app.services.financial_ratios import compute_all_ratios, compute_ratio_growth, compute_multi_year_ratios
from app.services.report_generator import generate_forensic_report, generate_markdown_report


class MockStatement:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


@pytest.fixture
def sample_statements():
    prev = MockStatement(
        year="2022",
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
        year="2023",
        net_sales=1200000,
        cogs=800000,
        accounts_receivable=250000,
        current_assets=600000,
        ppe=550000,
        total_assets=1300000,
        depreciation=30000,
        current_liabilities=400000,
        long_term_debt=300000,
        total_liabilities=700000,
        sga_expense=200000,
        income_continuing_operations=150000,
        cfo=-50000,
    )
    return curr, prev


def test_detect_anomalies(sample_statements):
    curr, prev = sample_statements
    anomalies = detect_anomalies(curr, prev)
    assert isinstance(anomalies, list)
    assert len(anomalies) > 0
    
    # Check that flags contain required schema fields
    for a in anomalies:
        assert "severity" in a
        assert "metric_flagged" in a
        assert "title" in a
        assert "description" in a


def test_check_benford_law():
    # Natural numbers conforming roughly to Benford
    natural_numbers = [123, 145, 189, 210, 240, 310, 420, 510, 620, 710, 830, 940, 1100, 1300, 1900]
    result = check_benford_law(natural_numbers)
    assert "status" in result
    assert "is_anomalous" in result


def test_compute_all_ratios(sample_statements):
    curr, _ = sample_statements
    ratios = compute_all_ratios(curr)
    
    assert "current_ratio" in ratios
    assert ratios["current_ratio"] == 1.5  # 600000 / 400000
    assert "gross_margin" in ratios
    assert "debt_to_assets" in ratios
    assert "days_sales_outstanding" in ratios
    assert ratios["gross_margin"] is not None


def test_compute_ratio_growth(sample_statements):
    curr, prev = sample_statements
    growth = compute_ratio_growth(curr, prev)
    assert isinstance(growth, dict)


def test_compute_multi_year_ratios(sample_statements):
    curr, prev = sample_statements
    series = compute_multi_year_ratios([prev, curr])
    assert len(series) == 2
    assert series[0]["year"] == "2022"
    assert series[1]["year"] == "2023"


def test_generate_forensic_report(sample_statements):
    curr, prev = sample_statements
    report = generate_forensic_report(
        company_name="Acme Forensics",
        ticker="ACME",
        curr_stmt=curr,
        prev_stmt=prev
    )

    assert "metadata" in report
    assert report["metadata"]["company_name"] == "Acme Forensics"
    assert "executive_summary" in report
    assert "beneish_indicators" in report
    assert "forensic_anomalies" in report
    assert "disclaimer" in report

    md = generate_markdown_report(report)
    assert isinstance(md, str)
    assert "# FinOmaly Forensic Audit Report: Acme Forensics" in md

