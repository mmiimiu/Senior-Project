"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import SearchHero from "@/components/SearchHero";
import CriteriaMonitor from "@/components/CriteriaMonitor";
import CondoGrid from "@/components/CondoGrid";
import Modals from "@/components/Modals";
import type {
  CondoItem,
  CondosListResponse,
  ConditionSummary,
  ExtractedEntities,
  SearchResponse,
} from "@/types/condo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [allCondos, setAllCondos] = useState<CondoItem[]>([]);
  const [recommendedCondos, setRecommendedCondos] = useState<CondoItem[]>([]);
  const [searchResults, setSearchResults] = useState<CondoItem[]>([]);
  const [defaultSummary, setDefaultSummary] = useState<ConditionSummary | null>(null);
  const [summary, setSummary] = useState<ConditionSummary | null>(null);
  const [entities, setEntities] = useState<ExtractedEntities>({});
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedCondo, setSelectedCondo] = useState<CondoItem | null>(null);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/condos`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: CondosListResponse = await res.json();
        const condos = data.condos || [];
        const recs = data.recommended?.length
          ? data.recommended
          : [3, 17, 28, 35, 45, 52]
              .map((id) => condos.find((c) => c.id === id))
              .filter((c): c is CondoItem => Boolean(c));
        setAllCondos(condos);
        setRecommendedCondos(recs);
        setDefaultSummary(data.condition_summary || null);
        setSummary(data.condition_summary || null);
        setError(false);
      } catch {
        setError(true);
      }
    };
    loadInitialData();
  }, []);

  const executeSearch = useCallback(
    async (overrideQuery?: string) => {
      const targetQuery = (overrideQuery !== undefined ? overrideQuery : query).trim();
      const reqId = ++requestIdRef.current;
      setActiveQuery(targetQuery);

      if (!targetQuery) {
        setSummary(defaultSummary);
        setEntities({});
        setSearchResults([]);
        setError(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/search/nlp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: targetQuery, top_k: 100 }),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: SearchResponse = await res.json();
        if (reqId !== requestIdRef.current) return;
        setSummary(data.condition_summary || null);
        setEntities(data.entities || {});
        setSearchResults(data.results || []);
        setError(false);
      } catch {
        if (reqId === requestIdRef.current) setError(true);
      } finally {
        if (reqId === requestIdRef.current) setLoading(false);
      }
    },
    [query, defaultSummary]
  );

  const handleResetHome = () => {
    setQuery("");
    setActiveQuery("");
    setShowAll(false);
    setSummary(defaultSummary);
    setEntities({});
    setSearchResults([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayedItems = activeQuery ? searchResults : showAll ? allCondos : recommendedCondos;
  const heading = activeQuery ? "ผลการค้นหาคอนโดมิเนียม" : "ห้องพักแนะนำตามไลฟ์สไตล์";
  const countText = activeQuery
    ? `${searchResults.length} โครงการ`
    : showAll
      ? `${allCondos.length} โครงการทั้งหมด`
      : `แนะนำ ${displayedItems.length} จาก ${allCondos.length} โครงการ`;

  return (
    <>
      <SearchHero
        query={query}
        loading={loading}
        onQueryChange={setQuery}
        onSubmit={executeSearch}
        onClear={() => {
          setQuery("");
          executeSearch("");
        }}
        onResetHome={handleResetHome}
      />
      <main className="main-container" style={{ paddingTop: 0 }}>
        <CriteriaMonitor summary={summary} entities={entities} query={activeQuery} />
        <CondoGrid
          heading={heading}
          countText={countText}
          items={displayedItems}
          entities={entities}
          error={error}
          showLoadMore={!activeQuery}
          showAll={showAll}
          recommendedCount={recommendedCondos.length}
          totalCount={allCondos.length}
          onSelectCondo={setSelectedCondo}
          onToggleShowAll={() => setShowAll((prev) => !prev)}
        />
      </main>
      <Modals
        selectedCondo={selectedCondo}
        showResearchModal={showResearchModal}
        onCloseCondo={() => setSelectedCondo(null)}
        onCloseResearch={() => setShowResearchModal(false)}
      />
    </>
  );
}
