// Thai NLP & Lifestyle Condominium Search Engine Prototype (<= 150 lines)
const STATIONS = ["พระราม 9", "อารีย์", "อ่อนนุช", "ทองหล่อ", "อุดมสุข", "เอกมัย", "พหลโยธิน", "สามย่าน", "แบริ่ง", "ปุณณวิถี", "อโศก", "สุขุมวิท", "ลาดพร้าว"];
const LIFESTYLE_MAP = [
  { key: "เหมาะกับ WFH", terms: ["wfh", "ทำงาน", "work from home", "co-working"] },
  { key: "เงียบสงบ", terms: ["เงียบ", "สงบ", "ไม่วุ่นวาย"] },
  { key: "เป็นส่วนตัว", terms: ["ส่วนตัว", "ยูนิตน้อย"] },
  { key: "ร่มรื่น", terms: ["ร่มรื่น", "ต้นไม้", "สวน", "วิวสวน"] },
  { key: "วิวเมืองสวย", terms: ["วิวเมือง", "วิวสวย", "high-rise"] },
  { key: "ราคาประหยัด", terms: ["ประหยัด", "ราคาถูก", "สบายกระเป๋า"] }
];

let showAll = false;
window.openResearchModal = () => { const m = document.getElementById("researchModal"); if (m) m.style.display = "flex"; };
window.closeResearchModal = () => { const m = document.getElementById("researchModal"); if (m) m.style.display = "none"; };
window.closeCondoModal = () => { const m = document.getElementById("condoModal"); if (m) m.style.display = "none"; };
window.resetToHome = () => {
  const input = document.getElementById("searchInput");
  if (input) input.value = "";
  showAll = false;
  if (window._performSearch) window._performSearch(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
window.toggleShowAll = () => { showAll = !showAll; if (window._performSearch) window._performSearch(false); };
window.openCondoDetail = (id) => {
  const m = document.getElementById("condoModal"), content = document.getElementById("condoModalContent");
  const data = window.CONDO_DATASET || (typeof CONDO_DATASET !== "undefined" ? CONDO_DATASET : []);
  const c = data.find(item => item.id === Number(id));
  if (!c || !m || !content) return;
  content.innerHTML = `
    <img src="${c.image}" class="condo-detail-img" alt="${c.name}">
    <h2 style="font-size:1.3rem;margin-bottom:4px;color:#fff;">${c.name}</h2>
    <div style="color:#a5b4fc;font-size:0.9rem;margin-bottom:8px;">📍 ${c.station} (${c.distance}) • สาย ${c.transitType}</div>
    <div class="detail-price-box">฿${c.price.toLocaleString()} <span style="font-size:0.8rem;font-weight:400;color:#94a3b8;">/ เดือน</span></div>
    <div style="margin-bottom:12px;display:flex;gap:8px;flex-wrap:wrap;">
      ${c.petFriendly ? '<span class="badge-pet" style="position:static;">🐾 เลี้ยงสัตว์ได้ (Pet-Friendly)</span>' : '<span style="background:rgba(255,255,255,0.08);padding:3px 8px;border-radius:6px;font-size:0.75rem;">ไม่อนุญาตเลี้ยงสัตว์</span>'}
      ${c.lifestyle.map(t => `<span class="lifestyle-tag highlight">${t}</span>`).join('')}
    </div>
    <div class="author-card"><strong>รายละเอียดโครงการ:</strong><p style="color:#cbd5e1;font-size:0.88rem;line-height:1.6;margin-top:6px;">${c.desc}</p></div>`;
  m.style.display = "flex";
};

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput"), clearBtn = document.getElementById("clearSearchBtn"), submitBtn = document.getElementById("submitSearchBtn");
  const condoGrid = document.getElementById("condoGrid"), resultsCount = document.getElementById("resultsCount"), resultsHeading = document.getElementById("resultsHeading");
  const matchScoreBadge = document.getElementById("matchScoreBadge"), loadMoreBox = document.getElementById("loadMoreBox"), loadMoreBtn = document.getElementById("loadMoreBtn");

  function extractEntities(text) {
    const q = text.toLowerCase().trim();
    if (!q) return { transit: null, specificStation: null, pet: null, lifestyles: [], maxPrice: null };
    const specificStation = STATIONS.find(st => q.includes(st.toLowerCase())) || null;
    let transit = specificStation;
    if (!transit) transit = q.includes("mrt") ? "MRT (ทุกสถานี)" : q.includes("bts") ? "BTS (ทุกสถานี)" : q.includes("รถไฟฟ้า") ? "ติดรถไฟฟ้า" : null;
    const pet = /เลี้ยงสัตว์|เลี้ยงหมา|เลี้ยงแมว|สัตว์เลี้ยง|pet/.test(q) ? true : null;
    const lifestyles = LIFESTYLE_MAP.filter(i => i.terms.some(t => q.includes(t))).map(i => i.key);
    let maxPrice = null;
    const pMatch = q.match(/(?:งบ|ไม่เกิน|ราคา|ต่ำกว่า)?\s*([0-9]{1,2}(?:,[0-9]{3})+|[0-9]{4,5})\s*(?:บาท)?/);
    if (pMatch && pMatch[1]) { const p = parseInt(pMatch[1].replace(/,/g, ""), 10); if (p >= 5000) maxPrice = p; }
    return { transit, specificStation, pet, lifestyles, maxPrice };
  }

  function updateEntityUI(entities, queryText) {
    const map = [
      { id: "entityTransit", val: entities.transit || (queryText ? "ไม่จำกัดสถานี" : "ทั้งหมด"), active: !!entities.transit },
      { id: "entityPet", val: entities.pet ? "✅ อนุญาตเลี้ยงสัตว์" : (queryText ? "ทั่วไป" : "ไม่ระบุ"), active: !!entities.pet },
      { id: "entityLifestyle", val: entities.lifestyles.join(", ") || (queryText ? "ทั่วไป" : "ไม่ระบุ"), active: entities.lifestyles.length > 0 },
      { id: "entityBudget", val: entities.maxPrice ? `≤ ${entities.maxPrice.toLocaleString()} บ./ด.` : "ไม่จำกัด", active: !!entities.maxPrice }
    ];
    map.forEach(({ id, val, active }) => {
      const el = document.getElementById(id);
      if (el) { el.querySelector(".ent-val").textContent = val; el.classList.toggle("active", active); }
    });
    const count = [entities.transit, entities.pet, entities.lifestyles.length, entities.maxPrice].filter(Boolean).length;
    matchScoreBadge.textContent = count > 0 ? `สกัดได้ ${count} มิติเงื่อนไข` : "พร้อมวิเคราะห์";
  }

  function performSearch(isExplicit = false) {
    const query = (searchInput.value || "").trim();
    clearBtn.style.display = query ? "block" : "none";
    const entities = extractEntities(query);
    updateEntityUI(entities, query);
    if (isExplicit && submitBtn) { submitBtn.textContent = "กำลังค้นหา..."; setTimeout(() => { submitBtn.textContent = "ค้นหา"; }, 350); }
    const data = window.CONDO_DATASET || (typeof CONDO_DATASET !== "undefined" ? CONDO_DATASET : []);
    let list = data;

    if (query) {
      resultsHeading.textContent = "ผลการค้นหาคอนโดมิเนียม";
      if (entities.specificStation) {
        list = list.filter(c => c.station.toLowerCase().includes(entities.specificStation.toLowerCase()) || c.desc.toLowerCase().includes(entities.specificStation.toLowerCase()) || c.name.toLowerCase().includes(entities.specificStation.toLowerCase()));
      } else if (entities.transit) {
        if (entities.transit.includes("BTS")) list = list.filter(c => c.transitType === "BTS" || c.station.includes("BTS"));
        else if (entities.transit.includes("MRT")) list = list.filter(c => c.transitType === "MRT" || c.station.includes("MRT"));
      }
      if (entities.pet === true) list = list.filter(c => c.petFriendly);
      if (entities.maxPrice) {
        const withinBudget = list.filter(c => c.price <= entities.maxPrice);
        if (withinBudget.length > 0) list = withinBudget;
      }
      if (loadMoreBox) loadMoreBox.style.display = "none";
      resultsCount.textContent = `${list.length} โครงการ`;
    } else {
      resultsHeading.textContent = "ห้องพักแนะนำตามไลฟ์สไตล์";
      if (loadMoreBox) {
        loadMoreBox.style.display = "block";
        loadMoreBtn.textContent = showAll ? "ย่อรายการแนะนำ (6 โครงการ)" : `ดูห้องพักทั้งหมด (${data.length} โครงการ)`;
      }
      resultsCount.textContent = showAll ? `${data.length} โครงการทั้งหมด` : `แนะนำ 6 จาก ${data.length} โครงการ`;
      if (!showAll) list = list.slice(0, 6);
    }
    renderCondos(list, entities);
  }

  function renderCondos(condos, entities) {
    if (!condos.length) {
      condoGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);"><p style="font-size: 1.1rem;">🔍 ไม่พบคอนโดมิเนียมที่ตรงกับย่านหรือเงื่อนไขที่พิมพ์</p><p style="font-size: 0.85rem; margin-top: 6px;">ลองพิมพ์ชื่อสถานีอื่น หรือปรับช่วงงบประมาณ</p></div>`;
      return;
    }
    condoGrid.innerHTML = condos.map(c => `
      <article class="condo-card" onclick="openCondoDetail(${c.id})">
        <div class="card-media">
          <img class="card-img" src="${c.image}" alt="${c.name}" loading="lazy">
          ${c.petFriendly ? '<span class="badge-pet">🐾 Pet-Friendly</span>' : ''}
          <div class="card-price-tag">฿${c.price.toLocaleString()}<span style="font-size: 0.7rem; font-weight: 400; color: #94a3b8;">/ด.</span></div>
        </div>
        <div class="card-body">
          <h3 class="card-name">${c.name}</h3>
          <div class="card-station">📍 ${c.station} (${c.distance})</div>
          <p class="card-desc">${c.desc}</p>
          <div class="card-tags">${c.lifestyle.map(t => `<span class="lifestyle-tag ${entities.lifestyles.includes(t) || (entities.pet && t === 'เลี้ยงสัตว์ได้') ? 'highlight' : ''}">${t}</span>`).join('')}</div>
          <button type="button" class="btn-view-detail" onclick="event.stopPropagation(); openCondoDetail(${c.id});">คลิกดูรายละเอียดเพิ่มเติม</button>
        </div>
      </article>`).join("");
  }

  window._performSearch = performSearch;
  searchInput.addEventListener("input", () => performSearch(false));
  searchInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); performSearch(true); } });
  if (submitBtn) submitBtn.addEventListener("click", e => { e.preventDefault(); performSearch(true); });
  const form = document.getElementById("searchForm");
  if (form) form.addEventListener("submit", e => { e.preventDefault(); performSearch(true); });
  clearBtn.addEventListener("click", () => { searchInput.value = ""; performSearch(true); searchInput.focus(); });
  document.querySelectorAll(".prompt-chip").forEach(chip => chip.addEventListener("click", () => { searchInput.value = chip.dataset.query; performSearch(true); }));
  performSearch(false);
});
