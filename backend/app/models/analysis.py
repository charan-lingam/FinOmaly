from typing import List, Optional
from decimal import Decimal
import uuid
from sqlalchemy import String, ForeignKey, DateTime, func, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class AnalysisRun(Base):
    __tablename__ = "analyses"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    company_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), index=True)
    target_statement_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("financial_statements.id", ondelete="RESTRICT"))
    prior_statement_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("financial_statements.id", ondelete="RESTRICT"))
    
    m_score: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4), nullable=True)
    risk_level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True) # e.g. "Low", "High", "Incomplete"
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    company: Mapped["Company"] = relationship(back_populates="analyses")
    indicators: Mapped[List["BeneishIndicator"]] = relationship(back_populates="analysis", cascade="all, delete-orphan")
    findings: Mapped[List["AnomalyFinding"]] = relationship(back_populates="analysis", cascade="all, delete-orphan")


class BeneishIndicator(Base):
    __tablename__ = "beneish_indicators"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    analysis_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("analyses.id", ondelete="CASCADE"), index=True)
    
    symbol: Mapped[str] = mapped_column(String(10), nullable=False) # e.g. 'DSRI'
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4), nullable=True)
    coefficient: Mapped[Decimal] = mapped_column(Numeric(10, 4), nullable=False)
    contribution: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4), nullable=True)

    analysis: Mapped["AnalysisRun"] = relationship(back_populates="indicators")


class AnomalyFinding(Base):
    __tablename__ = "anomaly_findings"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    analysis_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("analyses.id", ondelete="CASCADE"), index=True)
    
    severity: Mapped[str] = mapped_column(String(20), nullable=False) # e.g. 'high', 'medium'
    metric_flagged: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    suggested_review: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    analysis: Mapped["AnalysisRun"] = relationship(back_populates="findings")

