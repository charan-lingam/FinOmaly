from pydantic import BaseModel
from typing import Optional, List

class MScoreResult(BaseModel):
    dsri: Optional[float] = None
    gmi: Optional[float] = None
    aqi: Optional[float] = None
    sgi: Optional[float] = None
    depi: Optional[float] = None
    sgai: Optional[float] = None
    lvgi: Optional[float] = None
    tata: Optional[float] = None
    m_score: Optional[float] = None
    is_manipulator: Optional[bool] = None

class BeneishIndicatorItem(BaseModel):
    symbol: str
    name: str
    value: Optional[float] = None
    coefficient: float
    contribution: Optional[float] = None

class AnomalyFindingResponse(BaseModel):
    severity: str
    metric_flagged: str
    title: str
    description: str
    suggested_review: Optional[str] = None
    value: Optional[float] = None
    threshold: Optional[float] = None

class AnalysisResponse(BaseModel):
    id: Optional[str] = None
    company_id: str
    year_curr: str
    year_prev: str
    m_score_result: MScoreResult
    indicators: List[BeneishIndicatorItem] = []
    anomalies: List[AnomalyFindingResponse] = []
