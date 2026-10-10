from pydantic import BaseModel
from typing import Optional

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

class AnalysisResponse(BaseModel):
    company_id: str
    year_curr: str
    year_prev: str
    m_score_result: MScoreResult
