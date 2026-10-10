from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import SessionLocal
from app.models.user import User, Organization, OrganizationMembership

db = SessionLocal()
# Create a user with NO org
user = User(email="olduser@finomaly.com", hashed_password="pw")
db.add(user)
db.commit()

# Simulate deps.py
if not user.memberships:
    org = Organization(name="Workspace")
    db.add(org)
    db.flush()
    mem = OrganizationMembership(user_id=user.id, organization_id=org.id, role="owner")
    db.add(mem)
    db.commit()
    db.refresh(user)

print("Memberships after refresh:", len(user.memberships))
