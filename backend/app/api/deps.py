from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.core import security
from app.models.user import User
from app.schemas.user import TokenPayload

# OAuth2 defines where the frontend should send the POST request to get the token
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"/api/v1/login/access-token"
)

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, security.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
        
    user = db.scalar(select(User).where(User.id == token_data.sub))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Auto-create organization for backward compatibility
    if not user.memberships:
        from app.models.user import Organization, OrganizationMembership
        org = Organization(name=f"{user.email}'s Workspace")
        db.add(org)
        db.flush()
        membership = OrganizationMembership(
            user_id=user.id,
            organization_id=org.id,
            role="owner"
        )
        db.add(membership)
        db.commit()
        db.refresh(user)
        # Explicitly assign to avoid lazy-loading cache issues
        user.memberships = [membership]
        
    return user

