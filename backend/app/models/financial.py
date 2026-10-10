from typing import Optional
from decimal import Decimal
import uuid
from sqlalchemy import String, ForeignKey, DateTime, func, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class FinancialStatement(Base):
    """
    Represents the extracted and validated canonical financial data for a company for a specific year.
    This schema dictates the 12 variables required to compute the 8 Beneish indicators.
    """
    __tablename__ = "financial_statements"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), index=True)
    
    year: Mapped[str] = mapped_column(String(20), nullable=False) # e.g. "FY2024"
    document_reference: Mapped[Optional[str]] = mapped_column(String(500), nullable=True) # path in Supabase Storage
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # --- Canonical Financial Data Variables ---
    # We use Numeric(20, 4) to accurately store large financial figures without floating-point precision loss.
    
    net_sales: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    cogs: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    accounts_receivable: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    current_assets: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    ppe: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)  # Property, Plant, and Equipment
    total_assets: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    depreciation: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    current_liabilities: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    long_term_debt: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    total_liabilities: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    sga_expense: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)  # Sales, General, and Administrative Expense
    income_continuing_operations: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)
    cfo: Mapped[Optional[Decimal]] = mapped_column(Numeric(20, 4), nullable=True)  # Cash Flow from Operations

    company: Mapped["Company"] = relationship(back_populates="financial_statements")

