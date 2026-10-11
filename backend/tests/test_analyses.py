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


def test_sync_company_analyses_stores_indicators_in_database():
    import uuid
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.db.base import Base
    from app.models.company import Company
    from app.models.user import Organization
    from app.models.financial import FinancialStatement
    from app.models.analysis import AnalysisRun, BeneishIndicator, AnomalyFinding
    from app.services.analysis_persistence import sync_company_analyses

    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    org_id = uuid.uuid4()
    org = Organization(id=org_id, name="Test Org")
    db.add(org)

    comp_id = uuid.uuid4()
    comp = Company(id=comp_id, organization_id=org_id, name="Enron Test Corp", industry="Energy", ticker="ETEST")
    db.add(comp)

    # 2 consecutive statements
    s2022 = FinancialStatement(
        id=uuid.uuid4(),
        company_id=comp_id,
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
    s2023 = FinancialStatement(
        id=uuid.uuid4(),
        company_id=comp_id,
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
    db.add_all([s2022, s2023])
    db.commit()

    # Verify initially 0 stored indicators in db
    assert db.query(BeneishIndicator).count() == 0
    assert db.query(AnalysisRun).count() == 0

    # Execute sync_company_analyses
    runs = sync_company_analyses(db, comp_id)
    assert len(runs) == 1
    run = runs[0]

    # Verify AnalysisRun was stored in database
    db_run = db.query(AnalysisRun).filter(AnalysisRun.id == run.id).first()
    assert db_run is not None
    assert db_run.m_score is not None
    assert db_run.company_id == comp_id

    # Verify all 8 Beneish Indicators are stored in database
    db_indicators = db.query(BeneishIndicator).filter(BeneishIndicator.analysis_id == run.id).all()
    assert len(db_indicators) == 8

    symbols = {ind.symbol: ind for ind in db_indicators}
    for expected_sym in ["DSRI", "GMI", "AQI", "SGI", "DEPI", "SGAI", "LVGI", "TATA"]:
        assert expected_sym in symbols
        ind = symbols[expected_sym]
        assert ind.value is not None
        assert ind.coefficient is not None
        assert ind.contribution is not None

    # Verify Anomaly Findings stored in database
    db_findings = db.query(AnomalyFinding).filter(AnomalyFinding.analysis_id == run.id).all()
    assert len(db_findings) > 0
    for finding in db_findings:
        assert finding.severity in ["critical", "high", "medium", "low"]
        assert finding.metric_flagged != ""
        assert finding.title != ""

    # Verify idempotency (calling sync again should update, not duplicate)
    runs_again = sync_company_analyses(db, comp_id)
    assert len(runs_again) == 1
    assert db.query(AnalysisRun).count() == 1
    assert db.query(BeneishIndicator).count() == 8

    db.close()


