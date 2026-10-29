/** Thai NLP & Lifestyle Condominium Search Engine Prototype (100 Projects BTS Green Line) */
const STATIONS = ["คูคต","แยก คปอ.","พิพิธภัณฑ์กองทัพอากาศ","โรงพยาบาลภูมิพลอดุลยเดช","สะพานใหม่","สายหยุด","พหลโยธิน 59","วัดพระศรีมหาธาตุ","บางเขน","กรมทหารราบที่ 11","บางบัว","กรมป่าไม้","มหาวิทยาลัยเกษตรศาสตร์","ม.เกษตร","เสนานิคม","รัชโยธิน","พหลโยธิน 24","ห้าแยกลาดพร้าว","หมอชิต","สะพานควาย","อารีย์","อารี","สนามเป้า","อนุสาวรีย์ชัยสมรภูมิ","อนุสาวรีย์","พญาไท","ราชเทวี","สยาม","ชิดลม","เพลินจิต","นานา","อโศก","พร้อมพงษ์","ทองหล่อ","เอกมัย","พระโขนง","อ่อนนุช","บางจาก","ปุณณวิถี","อุดมสุข","บางนา","แบริ่ง","สำโรง","ปู่เจ้า","ช้างเอราวัณ","โรงเรียนนายเรือ","ปากน้ำ","ศรีนครินทร์","แพรกษา","สายลวด","เคหะฯ","เคหะ"];

const LIFESTYLE_MAP = [
  { key: "เหมาะกับ WFH", terms: ["wfh", "ทำงาน", "work from home", "co-working"] }, { key: "เงียบสงบ", terms: ["เงียบ", "สงบ", "ไม่วุ่นวาย"] }, { key: "เป็นส่วนตัว", terms: ["ส่วนตัว", "ยูนิตน้อย"] },
  { key: "ร่มรื่น", terms: ["ร่มรื่น", "ต้นไม้", "สวน"] }, { key: "วิวเมืองสวย", terms: ["วิวเมือง", "วิวสวย", "high-rise"] }, { key: "ราคาประหยัด", terms: ["ประหยัด", "ราคาถูก", "สบายกระเป๋า"] }
];

let showAll = false;
const getAllCondos = () => [...(window.CONDO_DATASET || []), ...(window.CONDO_DATASET_2 || []), ...(window.CONDO_DATASET_3 || []), ...(window.CONDO_DATASET_4 || []), ...(window.CONDO_DATASET_5 || [])];
const toggleModal = (id, s) => { const el = document.getElementById(id); if (el) el.style.display = s ? "flex" : "none"; };
window.openResearchModal = () => toggleModal("researchModal", true);
window.closeResearchModal = () => toggleModal("researchModal", false);
window.closeCondoModal = () => toggleModal("condoModal", false);
window.resetToHome = () => { const el = document.getElementById("searchInput"); if (el) el.value = ""; showAll = false; window._performSearch?.(); window.scrollTo({ top: 0, behavior: "smooth" }); };
window.toggleShowAll = () => { showAll = !showAll; window._performSearch?.(); };

window.openCondoDetail = (id) => {
  const c = getAllCondos().find((x) => x.id === Number(id)), el = document.getElementById("condoModalContent");
  if (!c || !el) return;
  el.innerHTML = `<img src="${c.image}" class="condo-detail-img" alt="${c.name}"><h2 style="font-size:1.3rem;margin-bottom:4px;color:#fff;">${c.name}</h2>
    <div style="color:#a5b4fc;font-size:0.9rem;margin-bottom:8px;">📍 ${c.station} (${c.distance}) • สาย ${c.transitType}</div>
    <div class="detail-price-box">฿${c.price.toLocaleString()} <span style="font-size:0.8rem;color:#94a3b8;">/ เดือน</span></div>
    <div style="margin-bottom:12px;display:flex;gap:8px;flex-wrap:wrap;">${c.petFriendly ? '<span class="badge-pet" style="position:static;">🐾 เลี้ยงสัตว์ได้ (Pet-Friendly)</span>' : '<span style="background:rgba(255,255,255,0.08);padding:3px 8px;border-radius:6px;font-size:0.75rem;">ไม่อนุญาตเลี้ยงสัตว์</span>'}${c.lifestyle.map((t) => `<span class="lifestyle-tag highlight">${t}</span>`).join("")}</div>
    <div class="author-card"><strong>รายละเอียดโครงการ:</strong><p style="color:#cbd5e1;font-size:0.88rem;line-height:1.6;margin-top:6px;">${c.desc}</p></div>`;
  toggleModal("condoModal", true);
};

document.addEventListener("DOMContentLoaded", () => {
  const normTh = (s) => (s || "").toLowerCase().replace(/[\u0e47-\u0e4c\s\-]/g, "");
  const lev = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return dp[a.length][b.length];
  };

  function findStation(q) {
    const nq = normTh(q);
    for (const st of STATIONS) if (q.toLowerCase().includes(st.toLowerCase()) || nq.includes(normTh(st))) return st;
    for (const st of STATIONS) {
      const nst = normTh(st);
      if (nst.length >= 3) for (let l = nst.length - 1; l <= nst.length + 1; l++) if (l >= 2) for (let i = 0; i <= nq.length - l; i++) if (lev(nq.substr(i, l), nst) <= 1) return st;
    }
    return null;
  }

  function extractEntities(text) {
    const q = (text || "").toLowerCase().trim();
    if (!q) return { transit: null, specificStation: null, pet: null, lifestyles: [], maxPrice: null, minPrice: null };
    const nq = normTh(q), specificStation = findStation(q);
    const transit = specificStation || (nq.includes("bts") || nq.includes("สายสีเขียว") || nq.includes("รถไฟ") ? "BTS สายสีเขียว (คูคต-เคหะฯ)" : null);
    const isNegPet = /ห้าม(?:ให้)?เลี้ยง|ไม่(?:ให้|อนุญาตให้|อนุญาต)?เลี้ยง|ไม่รับสัตว์|ไม่เอาสัตว์|ห้าม(?:มี)?สัตว์|no\s*pets?/i.test(q) || /หาม(?:ให)?เลี?ยง|ไม(?:ให|อนญาตให|อนญาต)?เลี?ยง|ไมรบสตว|ไมเอาสตว|หาม(?:ม)?สตว/i.test(nq);
    const isPosPet = !isNegPet && (/เลี?ยง(?:สัตว์|หมา|แมว|สุนัข)?|สัตว์เลี้ยง|สุนัข|หมา|แมว|pet-friendly|pet\b|dog\b|cat\b/i.test(q) || /เลี?ยง(?:สตว|หมา|แมว|สนข)?|สตวเลี?ยง|สนข|หมา|แมว/i.test(nq));
    const pet = isNegPet ? false : isPosPet ? true : null;
    const lifestyles = LIFESTYLE_MAP.filter((i) => i.terms.some((t) => nq.includes(normTh(t)))).map((i) => i.key);
    let minPrice = null, maxPrice = null;
    const rangeMatch = q.match(/([0-9]{1,2}(?:,[0-9]{3})+|[0-9]{4,5})\s*(?:-|ถึง|to)\s*([0-9]{1,2}(?:,[0-9]{3})+|[0-9]{4,5})/);
    const kMatch = q.match(/(?:งบ(?:ประมาณ)?|ไม่เกิน|ราคา|ต่ำกว่า|คุมงบ)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:k|พัน)\b/);
    const mMatch = q.match(/(?:งบ(?:ประมาณ)?|ไม่เกิน|ราคา|ต่ำกว่า|คุมงบ)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:หมื่น)\b/);
    const pMatch = q.match(/(?:งบ(?:ประมาณ)?|ไม่เกิน|ราคา|ต่ำกว่า|คุมงบ|งบไม่เกิน|ราคาไม่เกิน)?\s*([0-9]{1,2}(?:,[0-9]{3})+|[0-9]{4,5})\s*(?:บาท|บ\.|\/ด|เดือน)?/);
    if (rangeMatch) {
      const p1 = parseInt(rangeMatch[1].replace(/,/g, ""), 10), p2 = parseInt(rangeMatch[2].replace(/,/g, ""), 10);
      if (p1 >= 2500 && p2 >= 2500) { minPrice = Math.min(p1, p2); maxPrice = Math.max(p1, p2); }
    } else if (kMatch && Math.round(parseFloat(kMatch[1]) * 1000) >= 2500) maxPrice = Math.round(parseFloat(kMatch[1]) * 1000);
    else if (mMatch && Math.round(parseFloat(mMatch[1]) * 10000) >= 2500) maxPrice = Math.round(parseFloat(mMatch[1]) * 10000);
    else if (pMatch && parseInt(pMatch[1].replace(/,/g, ""), 10) >= 2500) maxPrice = parseInt(pMatch[1].replace(/,/g, ""), 10);
    return { transit, specificStation, pet, lifestyles, minPrice, maxPrice };
  }

  function updateEntityUI(ent, q) {
    [
      { id: "entityTransit", val: ent.transit || (q ? "สายสีเขียว (ทุกสถานี)" : "ทั้งหมด"), active: !!ent.transit },
      { id: "entityPet", val: ent.pet === true ? "✅ อนุญาตเลี้ยงสัตว์" : ent.pet === false ? "❌ ไม่อนุญาตเลี้ยงสัตว์" : q ? "ทั่วไป" : "ไม่ระบุ", active: ent.pet !== null },
      { id: "entityLifestyle", val: ent.lifestyles.join(", ") || (q ? "ทั่วไป" : "ไม่ระบุ"), active: ent.lifestyles.length > 0 },
      { id: "entityBudget", val: ent.minPrice && ent.maxPrice ? `${ent.minPrice.toLocaleString()} - ${ent.maxPrice.toLocaleString()} บ./ด.` : ent.maxPrice ? `≤ ${ent.maxPrice.toLocaleString()} บ./ด.` : ent.minPrice ? `≥ ${ent.minPrice.toLocaleString()} บ./ด.` : "ไม่จำกัด", active: !!(ent.maxPrice || ent.minPrice) }
    ].forEach(({ id, val, active }) => {
      const el = document.getElementById(id);
      if (el) { el.querySelector(".ent-val").textContent = val; el.classList.toggle("active", active); }
    });
    const c = [ent.transit, ent.pet, ent.lifestyles.length, ent.maxPrice || ent.minPrice].filter(Boolean).length;
    const badge = document.getElementById("matchScoreBadge");
    if (badge) badge.textContent = c > 0 ? `สกัดได้ ${c} มิติเงื่อนไข` : "พร้อมวิเคราะห์";
  }

  function performSearch(isExplicit = false) {
    const input = document.getElementById("searchInput"), query = (input?.value || "").trim();
    const clearBtn = document.getElementById("clearSearchBtn"), submitBtn = document.getElementById("submitSearchBtn");
    if (clearBtn) clearBtn.style.display = query ? "block" : "none";
    const ent = extractEntities(query);
    updateEntityUI(ent, query);
    if (isExplicit && submitBtn) {
      submitBtn.textContent = "กำลังค้นหา...";
      setTimeout(() => { submitBtn.textContent = "ค้นหา"; }, 300);
    }
    const data = getAllCondos();
    let list = data;
    const loadMoreBox = document.getElementById("loadMoreBox"), loadMoreBtn = document.getElementById("loadMoreBtn");
    if (query) {
      document.getElementById("resultsHeading").textContent = "ผลการค้นหาคอนโดมิเนียม";
      const nq = normTh(query);
      if (ent.specificStation) {
        const nst = normTh(ent.specificStation);
        list = list.filter((c) => normTh(c.station).includes(nst) || normTh(c.name).includes(nst));
      } else if (ent.transit) list = list.filter((c) => c.transitType === "BTS" || normTh(c.station).includes("bts"));
      if (ent.pet !== null) list = list.filter((c) => c.petFriendly === ent.pet);
      if (ent.maxPrice) list = list.filter((c) => c.price <= ent.maxPrice);
      if (ent.minPrice) list = list.filter((c) => c.price >= ent.minPrice);
      if (ent.lifestyles.length) list = list.filter((c) => c.lifestyle.some((t) => ent.lifestyles.includes(t)));
      if (!ent.specificStation && !ent.transit && ent.pet === null && !ent.lifestyles.length && !ent.maxPrice && !ent.minPrice) {
        list = list.filter((c) => normTh(c.name).includes(nq) || normTh(c.desc).includes(nq) || normTh(c.station).includes(nq));
      }
      if (loadMoreBox) loadMoreBox.style.display = "none";
      document.getElementById("resultsCount").textContent = `${list.length} โครงการ`;
    } else {
      document.getElementById("resultsHeading").textContent = "ห้องพักแนะนำตามไลฟ์สไตล์";
      if (loadMoreBox) loadMoreBox.style.display = "block";
      if (loadMoreBtn) loadMoreBtn.textContent = showAll ? "ย่อรายการแนะนำ (6 โครงการ)" : `ดูห้องพักทั้งหมด (${data.length} โครงการ)`;
      document.getElementById("resultsCount").textContent = showAll ? `${data.length} โครงการทั้งหมด` : `แนะนำ 6 จาก ${data.length} โครงการ`;
      if (!showAll) list = list.slice(0, 6);
    }
    renderCondos(list, ent);
  }

  function renderCondos(condos, ent) {
    const grid = document.getElementById("condoGrid");
    if (!condos.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--text-muted);"><div style="font-size:2.5rem;margin-bottom:12px;">🔍</div><p style="font-size:1.15rem;color:#fff;font-weight:600;">ไม่พบคอนโดมิเนียมที่ตรงกับทุกเงื่อนไขพร้อมกัน</p><p style="font-size:0.9rem;margin-top:8px;color:#94a3b8;line-height:1.6;">${ent.maxPrice ? `(คัดกรองเฉพาะห้องพักราคาไม่เกิน ฿${ent.maxPrice.toLocaleString()} บาท/เดือน ตามที่คุณระบุ โดยไม่มีห้องเกินงบ)` : "ลองปรับคำค้นหาหรือเปลี่ยนตัวกรอง"}</p></div>`;
      return;
    }
    grid.innerHTML = condos.map((c) => `<article class="condo-card" onclick="openCondoDetail(${c.id})"><div class="card-media"><img class="card-img" src="${c.image}" alt="${c.name}" loading="lazy">${c.petFriendly ? '<span class="badge-pet">🐾 Pet-Friendly</span>' : ""}<div class="card-price-tag">฿${c.price.toLocaleString()}<span style="font-size:0.7rem;font-weight:400;color:#94a3b8;">/ด.</span></div></div><div class="card-body"><h3 class="card-name">${c.name}</h3><div class="card-station">📍 ${c.station} (${c.distance})</div><p class="card-desc">${c.desc}</p><div class="card-tags">${c.lifestyle.map((t) => `<span class="lifestyle-tag ${ent.lifestyles?.includes(t) || (ent.pet && t === "เลี้ยงสัตว์ได้") ? "highlight" : ""}">${t}</span>`).join("")}</div><button type="button" class="btn-view-detail" onclick="event.stopPropagation();openCondoDetail(${c.id});">คลิกดูรายละเอียดเพิ่มเติม</button></div></article>`).join("");
  }

  window._performSearch = performSearch;
  const sIn = document.getElementById("searchInput");
  sIn?.addEventListener("input", () => { const b = document.getElementById("clearSearchBtn"); if (b) b.style.display = sIn.value.trim() ? "block" : "none"; });
  document.getElementById("searchForm")?.addEventListener("submit", (e) => { e.preventDefault(); performSearch(true); });
  document.getElementById("clearSearchBtn")?.addEventListener("click", () => { const el = document.getElementById("searchInput"); if (el) el.value = ""; performSearch(true); el?.focus(); });
  document.querySelectorAll(".prompt-chip").forEach((chip) => chip.addEventListener("click", () => { const el = document.getElementById("searchInput"); if (el) el.value = chip.dataset.query; performSearch(true); }));
  performSearch(false);
});
