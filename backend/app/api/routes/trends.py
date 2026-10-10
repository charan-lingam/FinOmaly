from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional
from pydantic import BaseModel

from app.db.session import get_db
from app.models.company import Company
from app.models.financial import FinancialStatement
from app.api.deps import get_current_user
from app.models.user import User
from app.services.beneish import calculate_m_score

router = APIRouter()


class TrendDataPoint(BaseModel):
    year: str
    # Raw financial metrics
    net_sales: Optional[float] = None
    gross_profit: Optional[float] = None   # net_sales - cogs
    cogs: Optional[float] = None
    accounts_receivable: Optional[float] = None
    total_assets: Optional[float] = None
    total_liabilities: Optional[float] = None
    cfo: Optional[float] = None
    sga_expense: Optional[float] = None
    depreciation: Optional[float] = None
    # Beneish indicators (computed where 2 years exist)
    dsri: Optional[float] = None
    gmi: Optional[float] = None
    aqi: Optional[float] = None
    sgi: Optional[float] = None
    depi: Optional[float] = None
    sgai: Optional[float] = None
    lvgi: Optional[float] = None
    tata: Optional[float] = None
    m_score: Optional[float] = None


@router.get("/{company_id}", response_model=List[TrendDataPoint])
def get_company_trends(
    company_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns per-year financial metrics and computed Beneish indicators for
    a given company, ordered oldest-to-newest (ideal for line charts).
    """
    # Verify company ownership
    user_org_ids = [m.organization_id for m in current_user.memberships]
    company = db.query(Company).filter(
        Company.id == company_id,
        Company.organization_id.in_(user_org_ids)
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found or unauthorized")

    # Deduplicate: keep only the most recent upload per year
    raw = (
        db.query(FinancialStatement)
        .filter(FinancialStatement.company_id == company_id)
        .order_by(FinancialStatement.year.asc(), FinancialStatement.created_at.desc())
        .all()
    )

    seen, statements = set(), []
    for s in raw:
        if s.year not in seen:
            statements.append(s)
            seen.add(s.year)

    if not statements:
        return []

    def to_float(val):
        try:
            return float(val) if val is not None else None
        except (TypeError, ValueError):
            return None

    # Build a lookup for Beneish indicators (need consecutive year pairs)
    # statements is ordered asc, so index i+1 is 'curr', index i is 'prev'
    beneish_by_year: dict = {}
    for i in range(1, len(statements)):
        curr = statements[i]
        prev = statements[i - 1]
        result = calculate_m_score(curr, prev)
        beneish_by_year[curr.year] = result

    points: List[TrendDataPoint] = []
    for stmt in statements:
        net_sales = to_float(stmt.net_sales)
        cogs = to_float(stmt.cogs)
        gross_profit = None
        if net_sales is not None and cogs is not None:
            gross_profit = net_sales - cogs

        b = beneish_by_year.get(stmt.year, {})

        points.append(TrendDataPoint(
            year=stmt.year,
            net_sales=net_sales,
            gross_profit=gross_profit,
            cogs=cogs,
            accounts_receivable=to_float(stmt.accounts_receivable),
            total_assets=to_float(stmt.total_assets),
            total_liabilities=to_float(stmt.total_liabilities),
            cfo=to_float(stmt.cfo),
            sga_expense=to_float(stmt.sga_expense),
            depreciation=to_float(stmt.depreciation),
            dsri=b.get("dsri"),
            gmi=b.get("gmi"),
            aqi=b.get("aqi"),
            sgi=b.get("sgi"),
            depi=b.get("depi"),
            sgai=b.get("sgai"),
            lvgi=b.get("lvgi"),
            tata=b.get("tata"),
            m_score=b.get("m_score"),
        ))

    return points
