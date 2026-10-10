from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
import pandas as pd
import io

from app.db.session import get_db
from app.models.company import Company
from app.models.financial import FinancialStatement
from app.schemas.statement import StatementResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

# Expected standard column mappings for the CSV
EXPECTED_COLUMNS = [
    "year", "net_sales", "cogs", "accounts_receivable", "current_assets", 
    "ppe", "total_assets", "depreciation", "current_liabilities", 
    "long_term_debt", "total_liabilities", "sga_expense", 
    "income_continuing_operations", "cfo"
]

@router.post("/upload/{company_id}", response_model=List[StatementResponse], status_code=status.HTTP_201_CREATED)
async def upload_csv_statement(
    company_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify company exists and belongs to user's org
    user_org_ids = [m.organization_id for m in current_user.memberships]
    company = db.query(Company).filter(Company.id == company_id, Company.organization_id.in_(user_org_ids)).first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found or unauthorized")

    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    contents = await file.read()
    
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing CSV: {str(e)}")

    # Basic normalization: lower case and replace spaces with underscores for column matching
    df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]

    if "year" not in df.columns:
        raise HTTPException(status_code=400, detail="CSV must contain a 'year' column")

    statements_created = []
    
    # Iterate through rows and create FinancialStatement records
    for _, row in df.iterrows():
        # Check if year is present and not nan
        if pd.isna(row.get('year')):
            continue

        stmt_data = {"company_id": company.id, "year": str(row['year'])}
        
        # Pull out known fields, letting them be None if missing
        for col in EXPECTED_COLUMNS:
            if col == "year":
                continue
            val = row.get(col)
            if pd.isna(val):
                stmt_data[col] = None
            else:
                try:
                    stmt_data[col] = float(val)
                except ValueError:
                    stmt_data[col] = None

        statement = FinancialStatement(**stmt_data)
        db.add(statement)
        statements_created.append(statement)

    db.commit()
    for s in statements_created:
        db.refresh(s)

    return statements_created
