from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from typing import List

from app.db.session import get_db
from app.models.company import Company
from app.models.financial import FinancialStatement
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.analysis import AnalysisResponse, MScoreResult, BeneishIndicatorItem, AnomalyFindingResponse
from app.services.analysis_persistence import sync_company_analyses

router = APIRouter()


def _format_analysis_response(company_id: uuid.UUID, run, db: Session) -> AnalysisResponse:
    # Build m_score_result dict from stored indicators
    ind_dict = {
        ind.symbol.lower(): (float(ind.value) if ind.value is not None else None)
        for ind in run.indicators
    }
    m_score = float(run.m_score) if run.m_score is not None else None
    is_manip = run.risk_level == "High" if run.risk_level else (m_score > -1.78 if m_score is not None else None)

    ind_dict["m_score"] = m_score
    ind_dict["is_manipulator"] = is_manip

    # Target and prior statement records for years
    target_stmt = db.query(FinancialStatement).filter(FinancialStatement.id == run.target_statement_id).first()
    prior_stmt = db.query(FinancialStatement).filter(FinancialStatement.id == run.prior_statement_id).first()

    return AnalysisResponse(
        id=str(run.id),
        company_id=str(company_id),
        year_curr=target_stmt.year if target_stmt else "",
        year_prev=prior_stmt.year if prior_stmt else "",
        m_score_result=MScoreResult(**ind_dict),
        indicators=[
            BeneishIndicatorItem(
                symbol=ind.symbol,
                name=ind.name,
                value=float(ind.value) if ind.value is not None else None,
                coefficient=float(ind.coefficient),
                contribution=float(ind.contribution) if ind.contribution is not None else None,
            )
            for ind in run.indicators
        ],
        anomalies=[
            AnomalyFindingResponse(
                severity=f.severity,
                metric_flagged=f.metric_flagged,
                title=f.title,
                description=f.description,
                suggested_review=f.suggested_review,
            )
            for f in run.findings
        ],
    )


@router.get("/{company_id}", response_model=List[AnalysisResponse])
def get_company_analysis(
    company_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify company exists and belongs to user's org
    user_org_ids = [m.organization_id for m in current_user.memberships]
    company = db.query(Company).filter(Company.id == company_id, Company.organization_id.in_(user_org_ids)).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found or unauthorized")

    runs = sync_company_analyses(db, company_id)
    return [_format_analysis_response(company_id, r, db) for r in runs]


@router.post("/calculate/{company_id}", response_model=List[AnalysisResponse])
def calculate_company_analysis(
    company_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Explicitly triggers calculation and database persistence of Beneish indicators,
    M-Score, and anomaly findings for the company's financial statements.
    """
    user_org_ids = [m.organization_id for m in current_user.memberships]
    company = db.query(Company).filter(Company.id == company_id, Company.organization_id.in_(user_org_ids)).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found or unauthorized")

    runs = sync_company_analyses(db, company_id)
    return [_format_analysis_response(company_id, r, db) for r in runs]
