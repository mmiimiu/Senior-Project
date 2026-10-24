/**
 * Thai NLP & Lifestyle Condominium Search Engine Prototype
 * BTS สายสีเขียว (คูคต - เคหะฯ) 100 โครงการ
 */

// รายชื่อสถานี BTS สายสีเขียว (คูคต - เคหะฯ)
const STATIONS = [
  "คูคต",
  "แยก คปอ.",
  "พิพิธภัณฑ์กองทัพอากาศ",
  "โรงพยาบาลภูมิพลอดุลยเดช",
  "สะพานใหม่",
  "สายหยุด",
  "พหลโยธิน 59",
  "วัดพระศรีมหาธาตุ",
  "บางเขน",
  "กรมทหารราบที่ 11",
  "บางบัว",
  "กรมป่าไม้",
  "มหาวิทยาลัยเกษตรศาสตร์",
  "ม.เกษตร",
  "เสนานิคม",
  "รัชโยธิน",
  "พหลโยธิน 24",
  "ห้าแยกลาดพร้าว",
  "หมอชิต",
  "สะพานควาย",
  "อารีย์",
  "อารี",
  "สนามเป้า",
  "อนุสาวรีย์ชัยสมรภูมิ",
  "อนุสาวรีย์",
  "พญาไท",
  "ราชเทวี",
  "สยาม",
  "ชิดลม",
  "เพลินจิต",
  "นานา",
  "อโศก",
  "พร้อมพงษ์",
  "ทองหล่อ",
  "เอกมัย",
  "พระโขนง",
  "อ่อนนุช",
  "บางจาก",
  "ปุณณวิถี",
  "อุดมสุข",
  "บางนา",
  "แบริ่ง",
  "สำโรง",
  "ปู่เจ้า",
  "ช้างเอราวัณ",
  "โรงเรียนนายเรือ",
  "ปากน้ำ",
  "ศรีนครินทร์",
  "แพรกษา",
  "สายลวด",
  "เคหะฯ",
  "เคหะ"
];

// พจนานุกรมคำค้นไลฟ์สไตล์
const LIFESTYLE_MAP = [
  { key: "เหมาะกับ WFH", terms: ["wfh", "ทำงาน", "work from home", "co-working"] },
  { key: "เงียบสงบ", terms: ["เงียบ", "สงบ", "ไม่วุ่นวาย"] },
  { key: "เป็นส่วนตัว", terms: ["ส่วนตัว", "ยูนิตน้อย"] },
  { key: "ร่มรื่น", terms: ["ร่มรื่น", "ต้นไม้", "สวน", "วิวสวน"] },
  { key: "วิวเมืองสวย", terms: ["วิวเมือง", "วิวสวย", "high-rise"] },
  { key: "ราคาประหยัด", terms: ["ประหยัด", "ราคาถูก", "สบายกระเป๋า"] }
];

let showAll = false;

// รวบรวมข้อมูลคอนโดมิเนียมทั้งหมด (100 โครงการจาก data.js ถึง data5.js)
const getAllCondos = () => [
  ...(window.CONDO_DATASET || []),
  ...(window.CONDO_DATASET_2 || []),
  ...(window.CONDO_DATASET_3 || []),
  ...(window.CONDO_DATASET_4 || []),
  ...(window.CONDO_DATASET_5 || [])
];

// ควบคุมการแสดงผล Modal
const toggleModal = (id, show) => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = show ? "flex" : "none";
  }
};

window.openResearchModal = () => toggleModal("researchModal", true);
window.closeResearchModal = () => toggleModal("researchModal", false);
window.closeCondoModal = () => toggleModal("condoModal", false);

// ฟังก์ชันรีเซ็ตกลับสู่หน้าแรก
window.resetToHome = () => {
  const input = document.getElementById("searchInput");
  if (input) {
    input.value = "";
  }
  showAll = false;
  if (window._performSearch) {
    window._performSearch();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// สลับการแสดงผลคอนโดทั้งหมด / 6 รายการแนะนำ
window.toggleShowAll = () => {
  showAll = !showAll;
  if (window._performSearch) {
    window._performSearch();
  }
};

// เปิดป๊อปอัปดูรายละเอียดคอนโดรายโครงการ
window.openCondoDetail = (id) => {
  const content = document.getElementById("condoModalContent");
  const c = getAllCondos().find((item) => item.id === Number(id));
  if (!c || !content) return;

  content.innerHTML = `
    <img src="${c.image}" class="condo-detail-img" alt="${c.name}">
    <h2 style="font-size: 1.3rem; margin-bottom: 4px; color: #fff;">${c.name}</h2>
    <div style="color: #a5b4fc; font-size: 0.9rem; margin-bottom: 8px;">
      📍 ${c.station} (${c.distance}) • สาย ${c.transitType}
    </div>
    <div class="detail-price-box">
      ฿${c.price.toLocaleString()} <span style="font-size: 0.8rem; font-weight: 400; color: #94a3b8;">/ เดือน</span>
    </div>
    <div style="margin-bottom: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
      ${
        c.petFriendly
          ? '<span class="badge-pet" style="position: static;">🐾 เลี้ยงสัตว์ได้ (Pet-Friendly)</span>'
          : '<span style="background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 6px; font-size: 0.75rem;">ไม่อนุญาตเลี้ยงสัตว์</span>'
      }
      ${c.lifestyle.map((t) => `<span class="lifestyle-tag highlight">${t}</span>`).join("")}
    </div>
    <div class="author-card">
      <strong>รายละเอียดโครงการ:</strong>
      <p style="color: #cbd5e1; font-size: 0.88rem; line-height: 1.6; margin-top: 6px;">
        ${c.desc}
      </p>
    </div>
  `;

  toggleModal("condoModal", true);
};

// เริ่มต้นการทำงานเมื่อโหลดหน้าเว็บสมบูรณ์
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearchBtn");
  const submitBtn = document.getElementById("submitSearchBtn");
  const condoGrid = document.getElementById("condoGrid");
  const resultsCount = document.getElementById("resultsCount");
  const resultsHeading = document.getElementById("resultsHeading");
  const matchScoreBadge = document.getElementById("matchScoreBadge");
  const loadMoreBox = document.getElementById("loadMoreBox");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const searchForm = document.getElementById("searchForm");

  // ฟังก์ชันลบวรรณยุกต์และช่องว่าง (Thai Normalization)
  const normTh = (s) => (s || "").toLowerCase().replace(/[\u0e47-\u0e4c\s\-]/g, "");

  // คำนวณระยะห่าง Levenshtein Distance สำหรับตรวจจับคำสะกดผิด
  const lev = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[a.length][b.length];
  };

  // ตรวจจับชื่อสถานีจากคำค้นหา (Exact Match + Fuzzy Match)
  function findStation(q) {
    const nq = normTh(q);

    // ตรวจสอบแบบค้นหาตรงคำ
    for (const st of STATIONS) {
      if (q.toLowerCase().includes(st.toLowerCase()) || nq.includes(normTh(st))) {
        return st;
      }
    }

    // ตรวจสอบคำสะกดใกล้เคียง (Fuzzy Levenshtein)
    for (const st of STATIONS) {
      const nst = normTh(st);
      if (nst.length >= 3) {
        for (let l = nst.length - 1; l <= nst.length + 1; l++) {
          if (l < 2) continue;
          for (let i = 0; i <= nq.length - l; i++) {
            if (lev(nq.substr(i, l), nst) <= 1) {
              return st;
            }
          }
        }
      }
    }

    return null;
  }

  // สกัดเอนทิตี 4 มิติจากประโยคค้นหาภาษาไทย
  function extractEntities(text) {
    const q = text.toLowerCase().trim();
    if (!q) {
      return {
        transit: null,
        specificStation: null,
        pet: null,
        lifestyles: [],
        maxPrice: null
      };
    }

    const nq = normTh(q);
    const specificStation = findStation(q);
    const transit =
      specificStation ||
      (nq.includes("bts") || nq.includes("สายสีเขียว") || nq.includes("รถไฟ")
        ? "BTS สายสีเขียว (คูคต-เคหะฯ)"
        : null);

    // ตรวจจับเงื่อนไขปฏิเสธสัตว์เลี้ยง (เช่น ห้ามเลี้ยง, ไม่ให้เลี้ยง, ไม่อนุญาตให้เลี้ยงสัตว์, no pet)
    const isNegPet =
      /ห้าม(?:ให้)?เลี้ยง|ไม่(?:ให้|อนุญาตให้|อนุญาต)?เลี้ยง|ไม่รับสัตว์|ไม่เอาสัตว์|ห้าม(?:มี)?สัตว์|no\s*pets?/i.test(q) ||
      /หาม(?:ให)?เลี?ยง|ไม(?:ให|อนญาตให|อนญาต)?เลี?ยง|ไมรบสตว|ไมเอาสตว|หาม(?:ม)?สตว/i.test(nq);

    // ตรวจจับเงื่อนไขต้องการเลี้ยงสัตว์ (เช่น เลี้ยงสัตว์, เลี้ยงหมา, เลี้ยงแมว, สัตว์เลี้ยง, pet, dog, cat)
    const isPosPet =
      !isNegPet &&
      (/เลี?ยง(?:สัตว์|หมา|แมว|สุนัข)?|สัตว์เลี้ยง|สุนัข|หมา|แมว|pet-friendly|pet\b|dog\b|cat\b/i.test(q) ||
        /เลี?ยง(?:สตว|หมา|แมว|สนข)?|สตวเลี?ยง|สนข|หมา|แมว/i.test(nq));

    const pet = isNegPet ? false : isPosPet ? true : null;

    // ตรวจจับไลฟ์สไตล์
    const lifestyles = LIFESTYLE_MAP
      .filter((i) => i.terms.some((t) => nq.includes(normTh(t))))
      .map((i) => i.key);

    // ตรวจจับงบประมาณราคา (รองรับ: ไม่เกิน 7000, 7000 บาท, งบ 5000-8000, 7k, 7 พัน, 1.5 หมื่น)
    let minPrice = null;
    let maxPrice = null;

    // 1. ตรวจจับช่วงราคา เช่น "5000-8000", "5,000 - 8,000", "5000 ถึง 8000"
    const rangeMatch = q.match(/([0-9]{1,2}(?:,[0-9]{3})+|[0-9]{4,5})\s*(?:-|ถึง|to)\s*([0-9]{1,2}(?:,[0-9]{3})+|[0-9]{4,5})/);
    if (rangeMatch) {
      const p1 = parseInt(rangeMatch[1].replace(/,/g, ""), 10);
      const p2 = parseInt(rangeMatch[2].replace(/,/g, ""), 10);
      if (p1 >= 2500 && p2 >= 2500) {
        minPrice = Math.min(p1, p2);
        maxPrice = Math.max(p1, p2);
      }
    } else {
      // 2. คำไทย/หน่วยย่อ เช่น "7k", "7 พัน", "1.5 หมื่น"
      const kMatch = q.match(/(?:งบ(?:ประมาณ)?|ไม่เกิน|ราคา|ต่ำกว่า|คุมงบ)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:k|พัน)\b/);
      const mMatch = q.match(/(?:งบ(?:ประมาณ)?|ไม่เกิน|ราคา|ต่ำกว่า|คุมงบ)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:หมื่น)\b/);

      if (kMatch) {
        const val = Math.round(parseFloat(kMatch[1]) * 1000);
        if (val >= 2500) maxPrice = val;
      } else if (mMatch) {
        const val = Math.round(parseFloat(mMatch[1]) * 10000);
        if (val >= 2500) maxPrice = val;
      } else {
        // 3. รูปแบบตัวเลขทั่วไป เช่น "ไม่เกิน7000", "งบ 7,000", "ราคา 8000", "7000 บาท"
        const pMatch = q.match(/(?:งบ(?:ประมาณ)?|ไม่เกิน|ราคา|ต่ำกว่า|คุมงบ|งบไม่เกิน|ราคาไม่เกิน)?\s*([0-9]{1,2}(?:,[0-9]{3})+|[0-9]{4,5})\s*(?:บาท|บ\.|/ด)?/);
        if (pMatch && pMatch[1]) {
          const p = parseInt(pMatch[1].replace(/,/g, ""), 10);
          if (p >= 2500) {
            maxPrice = p;
          }
        }
      }
    }

    return { transit, specificStation, pet, lifestyles, minPrice, maxPrice };
  }

  // อัปเดตการแสดงผล Badge เงื่อนไขที่สกัดได้
  function updateEntityUI(entities, queryText) {
    const map = [
      {
        id: "entityTransit",
        val: entities.transit || (queryText ? "สายสีเขียว (ทุกสถานี)" : "ทั้งหมด"),
        active: !!entities.transit
      },
      {
        id: "entityPet",
        val:
          entities.pet === true
            ? "✅ อนุญาตเลี้ยงสัตว์"
            : entities.pet === false
            ? "❌ ไม่อนุญาตเลี้ยงสัตว์"
            : queryText
            ? "ทั่วไป"
            : "ไม่ระบุ",
        active: entities.pet !== null
      },
      {
        id: "entityLifestyle",
        val: entities.lifestyles.join(", ") || (queryText ? "ทั่วไป" : "ไม่ระบุ"),
        active: entities.lifestyles.length > 0
      },
      {
        id: "entityBudget",
        val:
          entities.minPrice && entities.maxPrice
            ? `${entities.minPrice.toLocaleString()} - ${entities.maxPrice.toLocaleString()} บ./ด.`
            : entities.maxPrice
            ? `≤ ${entities.maxPrice.toLocaleString()} บ./ด.`
            : entities.minPrice
            ? `≥ ${entities.minPrice.toLocaleString()} บ./ด.`
            : "ไม่จำกัด",
        active: !!(entities.maxPrice || entities.minPrice)
      }
    ];

    map.forEach(({ id, val, active }) => {
      const el = document.getElementById(id);
      if (el) {
        el.querySelector(".ent-val").textContent = val;
        el.classList.toggle("active", active);
      }
    });

    const count = [
      entities.transit,
      entities.pet,
      entities.lifestyles.length,
      entities.maxPrice || entities.minPrice
    ].filter(Boolean).length;
    matchScoreBadge.textContent = count > 0 ? `สกัดได้ ${count} มิติเงื่อนไข` : "พร้อมวิเคราะห์";
  }

  // ประมวลผลการค้นหาและคัดกรองรายการคอนโด
  function performSearch(isExplicit = false) {
    const query = (searchInput.value || "").trim();
    clearBtn.style.display = query ? "block" : "none";

    const entities = extractEntities(query);
    updateEntityUI(entities, query);

    if (isExplicit && submitBtn) {
      submitBtn.textContent = "กำลังค้นหา...";
      setTimeout(() => {
        submitBtn.textContent = "ค้นหา";
      }, 300);
    }

    const data = getAllCondos();
    let list = data;

    if (query) {
      resultsHeading.textContent = "ผลการค้นหาคอนโดมิเนียม";
      const nq = normTh(query);

      // 1. กรองตามสถานี
      if (entities.specificStation) {
        const nst = normTh(entities.specificStation);
        list = list.filter(
          (c) =>
            normTh(c.station).includes(nst) ||
            normTh(c.desc).includes(nst) ||
            normTh(c.name).includes(nst)
        );
      } else if (entities.transit) {
        list = list.filter((c) => c.transitType === "BTS" || normTh(c.station).includes("bts"));
      }

      // 2. กรองตามเงื่อนไขสัตว์เลี้ยง
      if (entities.pet === true) {
        list = list.filter((c) => c.petFriendly);
      } else if (entities.pet === false) {
        list = list.filter((c) => !c.petFriendly);
      }

      // 3. กรองตามงบประมาณ (บังคับใช้อย่างเคร่งครัดตามงบที่ระบุ ห้ามแสดงห้องที่ราคาเกินงบเด็ดขาด)
      if (entities.maxPrice) {
        list = list.filter((c) => c.price <= entities.maxPrice);
      }
      if (entities.minPrice) {
        list = list.filter((c) => c.price >= entities.minPrice);
      }

      // 4. กรองตามไลฟ์สไตล์
      if (entities.lifestyles.length > 0) {
        const lsFiltered = list.filter((c) => c.lifestyle.some((tag) => entities.lifestyles.includes(tag)));
        if (lsFiltered.length > 0) {
          list = lsFiltered;
        }
      }

      // Fallback กรณีเป็นคำค้นทั่วไป
      if (
        !entities.specificStation &&
        !entities.transit &&
        entities.pet === null &&
        entities.lifestyles.length === 0 &&
        !entities.maxPrice &&
        !entities.minPrice
      ) {
        list = list.filter(
          (c) =>
            normTh(c.name).includes(nq) ||
            normTh(c.desc).includes(nq) ||
            normTh(c.station).includes(nq)
        );
      }

      if (loadMoreBox) {
        loadMoreBox.style.display = "none";
      }
      resultsCount.textContent = `${list.length} โครงการ`;
    } else {
      resultsHeading.textContent = "ห้องพักแนะนำตามไลฟ์สไตล์";
      if (loadMoreBox) {
        loadMoreBox.style.display = "block";
        loadMoreBtn.textContent = showAll
          ? "ย่อรายการแนะนำ (6 โครงการ)"
          : `ดูห้องพักทั้งหมด (${data.length} โครงการ)`;
      }
      resultsCount.textContent = showAll
        ? `${data.length} โครงการทั้งหมด`
        : `แนะนำ 6 จาก ${data.length} โครงการ`;
      if (!showAll) {
        list = list.slice(0, 6);
      }
    }

    renderCondos(list, entities);
  }

  // แสดงผลรายการคอนโดใน Grid
  function renderCondos(condos, entities) {
    if (!condos.length) {
      let adviceHtml = "";
      if (entities.maxPrice && entities.specificStation) {
        const allAtStation = getAllCondos().filter((c) =>
          normTh(c.station).includes(normTh(entities.specificStation))
        );
        const minAtStation = allAtStation.length
          ? Math.min(...allAtStation.map((c) => c.price))
          : null;

        if (minAtStation && minAtStation > entities.maxPrice) {
          adviceHtml = `
            <div style="margin-top: 16px; padding: 14px 18px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; text-align: left; max-width: 650px; margin-left: auto; margin-right: auto;">
              <div style="font-weight: 600; color: #fca5a5; margin-bottom: 4px;">💡 ข้อมูลราคาตลาดในย่าน ${entities.specificStation}:</div>
              <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5; margin: 0;">
                คอนโดมิเนียมย่าน <strong>${entities.specificStation}</strong> ในระบบมีอัตราค่าเช่าเริ่มต้นที่ <strong>฿${minAtStation.toLocaleString()} บาท/เดือน</strong> ซึ่งสูงกว่างบที่ระบุ (≤ ฿${entities.maxPrice.toLocaleString()} บ./ด.) ระบบจึงคัดกรองออกเพื่อรักษาความถูกต้องตามเงื่อนไขงบประมาณของคุณ
              </p>
            </div>
          `;
        }
      }

      // ค้นหาตัวเลือกแนะนำบน BTS สายสีเขียวในงบที่ระบุอย่างเข้มงวด (ห้ามเกินงบเด็ดขาด)
      let suggestionCondos = [];
      if (entities.maxPrice) {
        suggestionCondos = getAllCondos()
          .filter(
            (c) =>
              c.price <= entities.maxPrice &&
              (entities.pet === true ? c.petFriendly : entities.pet === false ? !c.petFriendly : true)
          )
          .slice(0, 4);
      }

      condoGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
          <p style="font-size: 1.15rem; color: #fff; font-weight: 500;">ไม่พบคอนโดมิเนียมที่ตรงกับทุกเงื่อนไขพร้อมกัน</p>
          <p style="font-size: 0.88rem; margin-top: 6px; color: #94a3b8;">
            ${
              entities.maxPrice
                ? `(คัดกรองเฉพาะห้องพักราคาไม่เกิน ฿${entities.maxPrice.toLocaleString()} บาท/เดือน ตามที่คุณระบุ)`
                : "ลองปรับคำค้นหาหรือตัวกรอง"
            }
          </p>
          ${adviceHtml}
          ${
            suggestionCondos.length
              ? `
            <div style="margin-top: 28px; text-align: left;">
              <h4 style="color: #a5b4fc; font-size: 0.95rem; margin-bottom: 12px; text-align: center;">
                ✨ โครงการแนะนำบน BTS สายสีเขียว ในงบไม่เกิน ฿${entities.maxPrice.toLocaleString()} บ./ด. ${
                  entities.pet === true ? "(อนุญาตเลี้ยงสัตว์)" : ""
                }:
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; max-width: 900px; margin: 0 auto;">
                ${suggestionCondos
                  .map(
                    (sc) => `
                  <div class="condo-card" style="cursor: pointer; padding: 12px;" onclick="openCondoDetail(${sc.id})">
                    <div style="display: flex; gap: 12px; align-items: center;">
                      <img src="${sc.image}" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;" alt="${sc.name}">
                      <div>
                        <div style="font-weight: 600; color: #fff; font-size: 0.9rem;">${sc.name}</div>
                        <div style="font-size: 0.78rem; color: #94a3b8;">📍 ${sc.station}</div>
                        <div style="font-size: 0.88rem; color: #6ee7b7; font-weight: 600; margin-top: 2px;">฿${sc.price.toLocaleString()} /ด. ${
                      sc.petFriendly ? "🐾" : ""
                    }</div>
                      </div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </div>
      `;
      return;
    }

    condoGrid.innerHTML = condos
      .map(
        (c) => `
      <article class="condo-card" onclick="openCondoDetail(${c.id})">
        <div class="card-media">
          <img class="card-img" src="${c.image}" alt="${c.name}" loading="lazy">
          ${c.petFriendly ? '<span class="badge-pet">🐾 Pet-Friendly</span>' : ""}
          <div class="card-price-tag">
            ฿${c.price.toLocaleString()}<span style="font-size: 0.7rem; font-weight: 400; color: #94a3b8;">/ด.</span>
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-name">${c.name}</h3>
          <div class="card-station">📍 ${c.station} (${c.distance})</div>
          <p class="card-desc">${c.desc}</p>
          <div class="card-tags">
            ${c.lifestyle
              .map(
                (t) =>
                  `<span class="lifestyle-tag ${
                    entities.lifestyles.includes(t) || (entities.pet && t === "เลี้ยงสัตว์ได้")
                      ? "highlight"
                      : ""
                  }">${t}</span>`
              )
              .join("")}
          </div>
          <button type="button" class="btn-view-detail" onclick="event.stopPropagation(); openCondoDetail(${c.id});">
            คลิกดูรายละเอียดเพิ่มเติม
          </button>
        </div>
      </article>
    `
      )
      .join("");
  }

  // ผูก Event Listeners สำหรับการค้นหาและปุ่มลัด
  window._performSearch = performSearch;

  searchInput.addEventListener("input", () => performSearch(false));

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      performSearch(true);
    });
  }

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    performSearch(true);
    searchInput.focus();
  });

  document.querySelectorAll(".prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      searchInput.value = chip.dataset.query;
      performSearch(true);
    });
  });

  // ทำการค้นหาเริ่มต้น
  performSearch(false);
});
