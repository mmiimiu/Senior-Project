// Data Source: คอนโดมิเนียมตามแนวรถไฟฟ้า BTS/MRT สำหรับทดสอบระบบค้นหาเชิงไลฟ์สไตล์
const CONDO_DATASET = [
  {
    id: 1,
    name: "Life Asoke Hype (ไลฟ์ อโศก ไฮป์)",
    station: "MRT พระราม 9",
    transitType: "MRT",
    distance: "300 ม.",
    price: 15000,
    petFriendly: false,
    lifestyle: ["เหมาะกับ WFH", "วิวเมืองสวย", "ส่วนกลางจัดเต็ม", "ฟิตเนส"],
    desc: "คอนโดทำเลใจกลาง New CBD ใกล้ MRT พระราม 9 ห้องแต่งครบ เหมาะสำหรับคนทำงาน WFH ต้องการสิ่งอำนวยความสะดวกครบครัน สระว่ายน้ำลอยฟ้า",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Whizdom Inspire Sukhumvit",
    station: "BTS ปุณณวิถี",
    transitType: "BTS",
    distance: "400 ม.",
    price: 18000,
    petFriendly: true,
    lifestyle: ["เลี้ยงสัตว์ได้", "เงียบสงบ", "ร่มรื่น", "เหมาะกับ WFH"],
    desc: "คอนโดบรรยากาศเงียบสงบและร่มรื่น ติด BTS ปุณณวิถี อนุญาตให้เลี้ยงสุนัขและแมว มี Pet Park เฉพาะ พร้อม Co-working space เงียบสงบ",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "The Monument Thong Lo",
    station: "BTS ทองหล่อ",
    transitType: "BTS",
    distance: "650 ม.",
    price: 35000,
    petFriendly: true,
    lifestyle: ["เลี้ยงสัตว์ได้", "เป็นส่วนตัว", "หรูหรา", "เงียบสงบ"],
    desc: "คอนโดระดับลักชัวรีใจกลางทองหล่อ ยูนิตน้อย เน้นความเป็นส่วนตัวสูง อนุญาตให้เลี้ยงสัตว์ขนาดเล็ก บรรยากาศเงียบสงบเหมือนอยู่บ้านเดี่ยว",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Ideo Mobi Sukhumvit 66",
    station: "BTS อุดมสุข",
    transitType: "BTS",
    distance: "50 ม.",
    price: 13500,
    petFriendly: false,
    lifestyle: ["ติดรถไฟฟ้า", "เงียบสงบ", "เหมาะกับ WFH", "เดินทางสะดวก"],
    desc: "คอนโดติดบันได BTS อุดมสุขเพียง 50 เมตร บรรยากาศในห้องเงียบสงบ กั้นห้องเป็นสัดส่วน ตอบโจทย์วัยทำงาน Work from Home สะดวกสบาย",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Rhythm Ekkamai Estate",
    station: "BTS เอกมัย",
    transitType: "BTS",
    distance: "450 ม.",
    price: 22000,
    petFriendly: false,
    lifestyle: ["เป็นส่วนตัว", "เงียบสงบ", "ร่มรื่น", "วิวสวน"],
    desc: "คอนโดเอกมัยที่ออกแบบให้อารมณ์บ้าน มีสวนแนวตั้งและสกายการ์เด้น ให้ความรู้สึกเงียบสงบ เป็นส่วนตัวสูง หลีกหนีความวุ่นวายของเมือง",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Noble Around Ari",
    station: "BTS อารีย์",
    transitType: "BTS",
    distance: "90 ม.",
    price: 16000,
    petFriendly: false,
    lifestyle: ["ติดรถไฟฟ้า", "คาเฟ่รอบด้าน", "เหมาะกับ WFH", "ดีไซน์โมเดิร์น"],
    desc: "คอนโดใกล้ BTS อารีย์เพียง 90 เมตร แหล่งรวมคาเฟ่และร้านอาหารชื่อดัง มีพื้นที่ Co-Kitchen และ Co-Working Space เหมาะกับไลฟ์สไตล์คนรุ่นใหม่",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "The Saint Residences",
    station: "MRT พหลโยธิน",
    transitType: "MRT",
    distance: "250 ม.",
    price: 12000,
    petFriendly: false,
    lifestyle: ["ราคาประหยัด", "เงียบสงบ", "ใกล้สวนสาธารณะ", "วิวสวน"],
    desc: "ใกล้ทั้ง BTS ห้าแยกลาดพร้าวและ MRT พหลโยธิน ติดสวนจตุจักร บรรยากาศร่มรื่น เงียบสงบ ในงบประมาณสบายกระเป๋า เดินทางสะดวกทุกเส้นทาง",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "U Delight @ Samyan-Station (ยู ดีไลท์ แอท สามย่าน)",
    station: "MRT สามย่าน",
    transitType: "MRT",
    distance: "350 ม.",
    price: 11500,
    petFriendly: false,
    lifestyle: ["เหมาะกับ WFH", "เงียบสงบ", "ราคาประหยัด", "เป็นส่วนตัว"],
    desc: "คอนโดใกล้ย่านสามย่านและจุฬาลงกรณ์มหาวิทยาลัย บรรยากาศเงียบสงบ เป็นส่วนตัว กั้นห้องทำงานเป็นสัดส่วน ตอบโจทย์ WFH งบไม่เกิน 12,000 บาท/เดือน",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Chambers On Nut 81",
    station: "BTS อ่อนนุช",
    transitType: "BTS",
    distance: "700 ม.",
    price: 11000,
    petFriendly: false,
    lifestyle: ["ราคาประหยัด", "เงียบสงบ", "ร่มรื่น", "เป็นส่วนตัว"],
    desc: "คอนโด Low-rise อารมณ์รีสอร์ตในซอยสุขุมวิท 81 บรรยากาศเงียบสงบ ร่มรื่น มีรถรับส่งไป BTS อ่อนนุช ค่าเช่าสบายกระเป๋า ไม่เกิน 12,000 บาท/เดือน",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Brixton Pet Friendly Sukhumvit 107",
    station: "BTS แบริ่ง",
    transitType: "BTS",
    distance: "550 ม.",
    price: 9500,
    petFriendly: true,
    lifestyle: ["เลี้ยงสัตว์ได้", "ราคาประหยัด", "เหมาะกับ WFH", "เป็นส่วนตัว"],
    desc: "คอนโด Pet Friendly 100% เลี้ยงหมาและแมวได้อย่างถูกระเบียบ มีสระว่ายน้ำสัตว์เลี้ยง พร้อมห้องทำงานส่วนตัว ราคาเริ่มต้นไม่เกินหมื่นบาท",
    image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=600&q=80"
  }
];
if (typeof window !== "undefined") window.CONDO_DATASET = CONDO_DATASET;
