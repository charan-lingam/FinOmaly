from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from typing import List

from app.db.session import get_db
from app.models.company import Company
from app.models.financial import FinancialStatement
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.analysis import AnalysisResponse, MScoreResult
from app.services.beneish import calculate_m_score

router = APIRouter()

@router.get("/{company_id}", response_model=List[AnalysisResponse])
def get_company_analysis(
    company_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify company exists and belongs to user's org
    user_org_ids = [m.organization_id for m in current_user.memberships]
    company = db.query(Company).filter(Company.id == company_id, Company.organization_id.in_(user_org_ids)).first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found or unauthorized")

    # Get statements for the company ordered by year desc
    statements = db.query(FinancialStatement).filter(FinancialStatement.company_id == company_id).order_by(FinancialStatement.year.desc()).all()
    
    if len(statements) < 2:
        return [] # Need at least 2 years to calculate
        
    analyses = []
    
    # Calculate for each consecutive pair of years
    for i in range(len(statements) - 1):
        curr = statements[i]
        prev = statements[i+1]
        
        result_dict = calculate_m_score(curr, prev)
        
        analyses.append(AnalysisResponse(
            company_id=str(company_id),
            year_curr=curr.year,
            year_prev=prev.year,
            m_score_result=MScoreResult(**result_dict)
        ))
        
    return analyses
