from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.session import get_db
from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[CompanyResponse])
def get_companies(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_org_ids = [m.organization_id for m in current_user.memberships]
    companies = db.query(Company).filter(Company.organization_id.in_(user_org_ids)).all()
    return companies

@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(company: CompanyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.memberships:
        raise HTTPException(status_code=400, detail="User does not belong to any organization")
    
    org_id = current_user.memberships[0].organization_id
    
    db_company = Company(
        name=company.name,
        ticker=company.ticker,
        industry=company.industry,
        organization_id=org_id
    )
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company
