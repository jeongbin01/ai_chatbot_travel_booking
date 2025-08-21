from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date, datetime
from decimal import Decimal

class Booking(SQLModel, table=True):
    booking_id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.user_id")
    accommodation_id: Optional[int] = Field(default=None, foreign_key="accommodation.accommodation_id")
    room_type_id: Optional[int] = Field(default=None, foreign_key="roomtype.room_type_id")
    product_id: Optional[int] = Field(default=None, foreign_key="travelproduct.product_id")
    schedule_id: Optional[int] = Field(default=None, foreign_key="productschedule.schedule_id")

    booking_type: Optional[str] = None
    check_in_date: Optional[date] = None
    check_out_date: Optional[date] = None

    num_adults: int = Field(default=1)
    num_children: int = Field(default=0)

    total_amount: Decimal
    currency: str = Field(default="KRW")
    booking_date: datetime = Field(default_factory=datetime.utcnow)

    status: Optional[str] = None
    request_notes: Optional[str] = None

    cancellation_date: Optional[datetime] = None
    cancellation_fee: Decimal = Field(default=Decimal("0.00"))
