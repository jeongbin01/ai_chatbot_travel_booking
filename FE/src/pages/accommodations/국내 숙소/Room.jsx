// src/pages/PricePolicyPage.jsx
import React, { useEffect, useState } from "react";

export default function PricePolicyPage() {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8888/api/price-policies")
      .then((res) => res.json())
      .then((data) => setPolicies(data));
  }, []);

  return (
    <div>
      <h2>가격 정책 목록</h2>
      <ul>
        {policies.map((p) => (
          <li key={p.id}>{p.title} - {p.price}</li>
        ))}
      </ul>
    </div>
  );
}
