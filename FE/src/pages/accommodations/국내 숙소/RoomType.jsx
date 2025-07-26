// src/pages/RoomPage.jsx
import React, { useEffect, useState } from "react";

export default function RoomPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8888/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

  return (
    <div>
      <h2>객실 목록</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
}
