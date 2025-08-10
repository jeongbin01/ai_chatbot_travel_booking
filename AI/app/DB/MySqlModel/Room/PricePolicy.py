from datetime import date
from decimal import Decimal


class PricePolicy(SQLModel, table=True):
    __tablename__ = "price_policy"

    price_policy_id: Optional[int] = Field(default=None, primary_key=True, alias="price_policy_id")

    room_type_id: int = Field(foreign_key="room_type.room_type_id", nullable=False)

    start_date: date = Field(nullable=False)
    end_date: date = Field(nullable=False)

    base_price: Decimal = Field(nullable=False, sa_column_kwargs={"precision": 10, "scale": 2})
    additional_person_surcharge: Decimal = Field(default=Decimal("0.00"), sa_column_kwargs={"precision": 10, "scale": 2})
    weekend_surcharge: Decimal = Field(default=Decimal("0.00"), sa_column_kwargs={"precision": 10, "scale": 2})
    holiday_surcharge: Decimal = Field(default=Decimal("0.00"), sa_column_kwargs={"precision": 10, "scale": 2})
