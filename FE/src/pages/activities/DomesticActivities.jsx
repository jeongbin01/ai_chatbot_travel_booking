import React, { useMemo, useState } from "react";
import ActivityCard from "../../components/act/ActivityCard";
import data from "./domesticActivitiesData";

const DomesticActivities = () => {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter(
      (v) =>
        v.name.toLowerCase().includes(t) ||
        (v.location ?? "").toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <main className="activities-container">
      <header className="activities-header">
        <h2>국내 액티비티</h2>
        <div className="search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름/지역 검색" />
          {q && <button className="clear" onClick={() => setQ("")}>✕</button>}
        </div>
      </header>

      <section className="activities-grid">
        {list.map((item) => (
          <ActivityCard key={`${item.type}-${item.id}`} activity={item} />
        ))}
      </section>
    </main>
  );
};

export default DomesticActivities;
