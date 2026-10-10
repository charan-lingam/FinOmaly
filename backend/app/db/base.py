from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.declarative import declared_attr


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy ORM models.
    Provides automatic table naming based on the model class name.
    """
    
    @declared_attr.directive
    def __tablename__(cls) -> str:
        """
        Automatically generate table names from class names.
        E.g. "User" -> "user", "FinancialStatement" -> "financialstatement"
        We can override this in specific models if we want snake_case (e.g. "financial_statements")
        but this provides a sensible default.
        """
        return cls.__name__.lower()

