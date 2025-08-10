class Room(SQLModel, table=True):
    __tablename__ = "room"

    room_id: Optional[int] = Field(default=None, primary_key=True, alias="room_id")

    room_type_id: int = Field(foreign_key="room_type.room_type_id", nullable=False)

    room_number: Optional[str] = Field(default=None)
    is_available: bool = Field(default=True, nullable=False)
