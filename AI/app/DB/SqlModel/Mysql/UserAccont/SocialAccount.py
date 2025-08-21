from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class SocialAccount(SQLModel, table=True):
    social_account_id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.user_id", nullable=False)

    provider: str = Field(nullable=False)
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    last_synced_date: Optional[datetime] = None
