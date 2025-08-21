class RoomType(SQLModel, table=True):
    __tablename__ = "room_type"

    room_type_id: Optional[int] = Field(default=None, primary_key=True, alias="room_type_id")

    accommodation_id: int = Field(foreign_key="Accommodation.accommodation_id", nullable=False)

    name: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)

    max_occupancy: int = Field(nullable=False)
    standard_occupancy: int = Field(nullable=False)

    bed_type: Optional[str] = Field(default=None)
    area_sqm: Optional[Decimal] = Field(default=None, sa_column_kwargs={"precision": 6, "scale": 2})
