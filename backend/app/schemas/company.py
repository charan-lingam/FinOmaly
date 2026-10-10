from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime

class CompanyBase(BaseModel):
    name: str
    ticker: str
    industry: str

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: uuid.UUID
    organization_id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
