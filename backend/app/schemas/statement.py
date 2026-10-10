from pydantic import BaseModel, ConfigDict
from typing import Optional
import uuid
from datetime import datetime
from decimal import Decimal

class StatementBase(BaseModel):
    year: str
    net_sales: Optional[Decimal] = None
    cogs: Optional[Decimal] = None
    accounts_receivable: Optional[Decimal] = None
    current_assets: Optional[Decimal] = None
    ppe: Optional[Decimal] = None
    total_assets: Optional[Decimal] = None
    depreciation: Optional[Decimal] = None
    current_liabilities: Optional[Decimal] = None
    long_term_debt: Optional[Decimal] = None
    total_liabilities: Optional[Decimal] = None
    sga_expense: Optional[Decimal] = None
    income_continuing_operations: Optional[Decimal] = None
    cfo: Optional[Decimal] = None

class StatementCreate(StatementBase):
    pass

class StatementResponse(StatementBase):
    id: uuid.UUID
    company_id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
