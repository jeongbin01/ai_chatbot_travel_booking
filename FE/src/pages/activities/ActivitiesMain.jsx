// src/pages/activities/ActivitiesMain.jsx
import React, { useMemo, useState } from "react";
import ActivityCard from "../../components/act/ActivityCard";
import domestic from "./domesticActivitiesData";
import international from "./internationalActivitiesData";
import "../../styles/pages/Activities.css";

export default function ActivitiesMain() {
  const [tab, setTab] = useState("international"); // 'international' | 'domestic'
  const [q, setQ] = useState("");

  const data = useMemo(
    () => (tab === "domestic" ? domestic : international),
    [tab]
  );

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter(
      (v) =>
        (v.name ?? "").toLowerCase().includes(t) ||
        (v.location ?? "").toLowerCase().includes(t) ||
        (v.category ?? "").toLowerCase().includes(t) ||
        (v.description ?? "").toLowerCase().includes(t)
    );
  }, [q, data]);

  return (
    <main className="activities activities--white">
      <div className="activities__container accommodation-list-wrapper">
        <header className="activities__header">
          <div>
            <h1 className="activities__title accommodation-title">
              <i className="bi bi-globe-americas me-2"></i>전 세계 액티비티
            </h1>
          </div>

          <nav
            className="activities__tabs"
            role="tablist"
            aria-label="액티비티 구분"
          >
            <button
              role="tab"
              aria-selected={tab === "domestic"}
              className={`tab ${tab === "domestic" ? "is-active" : ""}`}
              onClick={() => setTab("domestic")}
            >
              국내
            </button>
            <button
              role="tab"
              aria-selected={tab === "international"}
              className={`tab ${tab === "international" ? "is-active" : ""}`}
              onClick={() => setTab("international")}
            >
              해외
            </button>
          </nav>

          <div className="activities__search search-container">
            <div className="search-box">
              <i className="bi bi-search"></i>
              <input
                className="searchbar"
                placeholder="도시, 테마, 키워드로 검색"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="액티비티 검색어"
              />
              {q && (
                <button
                  className="search-clear"
                  onClick={() => setQ("")}
                  aria-label="검색어 지우기"
                  title="지우기"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </header>

        <section
          className="activities__grid accommodation-grid"
          aria-live="polite"
        >
          {list.length === 0 ? (
            <div className="activities__empty no-results">
              <i className="bi bi-exclamation-circle me-1"></i>
              검색 결과가 없습니다.
            </div>
          ) : (
            list.map((item) => (
              <div key={item.id} className="accommodation-card">
                <ActivityCard item={item} />
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
