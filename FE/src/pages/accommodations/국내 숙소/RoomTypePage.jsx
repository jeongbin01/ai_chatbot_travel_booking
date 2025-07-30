// // src/pages/RoomTypePage.jsx
// import React, { useEffect, useState } from "react";

// export default function RoomTypePage() {
//   const [roomTypes, setRoomTypes] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:8888/api/room-types")
//       .then((res) => res.json())
//       .then((data) => setRoomTypes(data));
//   }, []);

//   return (
//     <div>
//       <h2>객실 유형</h2>
//       <ul>
//         {roomTypes.map((type) => (
//           <li key={type.id}>{type.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
