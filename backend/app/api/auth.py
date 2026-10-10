from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.core import security
from app.models.user import User, Organization, OrganizationMembership
from app.schemas.user import Token, UserSignup

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # Find user by email (normalize it just in case)
    email = form_data.username.lower().strip()
    user = db.scalar(select(User).where(User.email == email))
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    return {
        "access_token": security.create_access_token(user.id),
        "token_type": "bearer",
    }


# Convenience endpoint to seed a test user since we don't have a signup page yet
@router.post("/seed", status_code=201)
def seed_test_user(db: Session = Depends(get_db)):
    """Creates a test user and test organization to login with."""
    test_email = "test@finomaly.com"
    existing_user = db.scalar(select(User).where(User.email == test_email))
    if existing_user:
        return {"msg": "Test user already exists"}
        
    # Create user
    user = User(
        email=test_email,
        hashed_password=security.get_password_hash("testpassword123")
    )
    db.add(user)
    
    # Create org
    org = Organization(name="Test Org Ltd")
    db.add(org)
    db.flush() # get IDs
    
    # Link them
    membership = OrganizationMembership(
        user_id=user.id,
        organization_id=org.id,
        role="owner"
    )
    db.add(membership)
    db.commit()
    
    return {"msg": "Created test user: test@finomaly.com / testpassword123"}

@router.post("/signup", status_code=201)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    """Creates a new user and an associated personal organization."""
    # Check if user already exists (normalize email)
    email = data.email.lower().strip()
    existing_user = db.scalar(select(User).where(User.email == email))
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
        
    # Create user
    user = User(
        email=email,
        hashed_password=security.get_password_hash(data.password)
    )
    db.add(user)
    
    # Create org
    org_name = data.org_name if data.org_name else f"{data.email}'s Workspace"
    org = Organization(name=org_name)
    db.add(org)
    db.flush() # get IDs
    
    # Link them
    membership = OrganizationMembership(
        user_id=user.id,
        organization_id=org.id,
        role="owner"
    )
    db.add(membership)
    db.commit()
    
    return {"msg": "Signup successful"}
