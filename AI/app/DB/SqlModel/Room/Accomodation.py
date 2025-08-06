from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime, time
from decimal import Decimal


class Accommodation(SQLModel, table=True):
    __tablename__ = "Accommodation"

    accommodation_id: Optional[int] = Field(default=None, primary_key=True, alias="accommodation_id")

    owner_user_id: int = Field(foreign_key="user.user_id", nullable=False, alias="owner_user_id")

    name: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    address: str = Field(nullable=False)

    latitude: Optional[Decimal] = Field(default=None, sa_column_kwargs={"precision": 10, "scale": 8})
    longitude: Optional[Decimal] = Field(default=None, sa_column_kwargs={"precision": 11, "scale": 8})

    type: Optional[str] = Field(default=None)
    contact: Optional[str] = Field(default=None)

    check_in_time: Optional[time] = Field(default=None)
    check_out_time: Optional[time] = Field(default=None)

    is_domestic: str = Field(default="Y", nullable=False, max_length=1)
    rating_avg: Decimal = Field(default=Decimal("0.0"), sa_column_kwargs={"precision": 3, "scale": 2})
    total_reviews: int = Field(default=0)

    registration_date: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    is_active: bool = Field(default=True, nullable=False)