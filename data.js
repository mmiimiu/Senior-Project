// Data Source Part 1: คอนโดมิเนียม BTS สายสีเขียว (คูคต - เคหะฯ) [โซนคูคต - สะพานใหม่ - พหลโยธิน - อารีย์] (id 1-10)
const CONDO_DATASET = [
  {
    id: 1,
    name: "The Base Saphanmai",
    station: "BTS สายหยุด",
    transitType: "BTS",
    distance: "30 ม.",
    price: 11000,
    petFriendly: false,
    lifestyle: ["ติดรถไฟฟ้า", "เหมาะกับ WFH", "วิวเมืองสวย", "เดินทางสะดวก"],
    desc: "คอนโดติดบันได BTS สายหยุด บนถนนพหลโยธิน เดินทางเข้าเมืองสะดวกรวดเร็ว ใกล้ตลาดยิ่งเจริญและสะพานใหม่ ส่วนกลางสไตล์ Modern Loft พร้อมฟิตเนสวิวเปิด 360 องศา",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Regent Home Bangkhen (Phase 15)",
    station: "BTS วัดพระศรีมหาธาตุ (บางเขน)",
    transitType: "BTS",
    distance: "250 ม.",
    price: 7500,
    petFriendly: false,
    lifestyle: ["ราคาประหยัด", "ติดรถไฟฟ้า", "เดินทางสะดวก"],
    desc: "คอนโดราคาสบายกระเป๋า ย่านบางเขน ใกล้สถานีอินเตอร์เชนจ์ BTS วัดพระศรีมหาธาตุ (บางเขน) เชื่อมต่อรถไฟฟ้าสายสีเขียวและสายสีชมพู ใกล้วงเวียนบางเขน ม.ราชภัฏพระนคร และ ม.เกริก",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "KnightsBridge Space Ratchayothin",
    station: "BTS รัชโยธิน",
    transitType: "BTS",
    distance: "20 ม.",
    price: 24000,
    petFriendly: true,
    lifestyle: ["เหมาะกับ WFH", "วิวเมืองสวย", "เป็นส่วนตัว", "ติดรถไฟฟ้า"],
    desc: "คอนโด Duo Space เพดานสูง 4.2 เมตร ติดสถานี BTS รัชโยธิน วิวเมืองมุมสูงโปร่งโล่ง เหมาะกับคนทำงาน WFH ยูนิตเป็นมิตรต่อสัตว์เลี้ยง (Pet-Friendly) ใกล้ Major Cineplex รัชโยธิน",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Kave Ava Phahol-Kaset",
    station: "BTS มหาวิทยาลัยเกษตรศาสตร์",
    transitType: "BTS",
    distance: "350 ม.",
    price: 12500,
    petFriendly: false,
    lifestyle: ["เหมาะกับ WFH", "ราคาประหยัด", "เดินทางสะดวก"],
    desc: "คอนโดแต่งครบสไตล์คนรุ่นใหม่ ใกล้มหาวิทยาลัยเกษตรศาสตร์ (ม.เกษตร) มี Co-working space ครบวงจร เหมาะกับนักศึกษาและคนทำงานในย่านพหลโยธิน เดินทางด้วย BTS สายสีเขียวสะดวกมาก",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Noble Around Ari",
    station: "BTS อารีย์",
    transitType: "BTS",
    distance: "90 ม.",
    price: 26000,
    petFriendly: false,
    lifestyle: ["เหมาะกับ WFH", "เป็นส่วนตัว", "วิวเมืองสวย", "เดินทางสะดวก"],
    desc: "คอนโดระดับลักชัวรีใจกลางย่านอารีย์ ห่างสถานี BTS อารีย์เพียง 90 เมตร ใกล้ La Villa Ari และคาเฟ่ชั้นนำมากมาย บรรยากาศเงียบสงบ เป็นส่วนตัวสูง พร้อมพื้นที่ทำงาน Co-working หรูหรา",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "The Monument Sanampao",
    station: "BTS สนามเป้า",
    transitType: "BTS",
    distance: "150 ม.",
    price: 38000,
    petFriendly: true,
    lifestyle: ["เป็นส่วนตัว", "วิวเมืองสวย", "เงียบสงบ"],
    desc: "คอนโดซูเปอร์ลักชัวรี High-Rise ติดแนว BTS สนามเป้า ยูนิตน้อยมีความเป็นส่วนตัวสูงสุด อนุญาตเลี้ยงสัตว์เลี้ยง (Pet-Friendly) บรรยากาศสงบ ไม่วุ่นวาย เชื่อมต่อสู่ใจกลางเมืองในไม่กี่นาที",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Life Ladprao",
    station: "BTS ห้าแยกลาดพร้าว",
    transitType: "BTS",
    distance: "50 ม.",
    price: 16500,
    petFriendly: false,
    lifestyle: ["ติดรถไฟฟ้า", "เหมาะกับ WFH", "เดินทางสะดวก"],
    desc: "คอนโดวิวพาโนรามา ตรงข้ามเซ็นทรัลลาดพร้าว ติด BTS ห้าแยกลาดพร้าว และเชื่อมต่อ MRT พหลโยธิน ทำเลศักยภาพสูงสุดของกรุงเทพตอนเหนือ ส่วนกลางขนาดใหญ่พร้อม Co-working space สองชั้น",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Origin Plug & Play Phahol-Saphanmai",
    station: "BTS สะพานใหม่",
    transitType: "BTS",
    distance: "80 ม.",
    price: 9000,
    petFriendly: false,
    lifestyle: ["ราคาประหยัด", "ติดรถไฟฟ้า", "เหมาะกับ WFH"],
    desc: "คอนโดสไตล์ Duo Space ห้องสองชั้น เพดานสูง โปร่งโล่ง ใกล้ BTS สะพานใหม่ และตลาดสะพานใหม่ ราคาสบายกระเป๋าไม่เกินหมื่น เหมาะกับคนรุ่นใหม่ที่ต้องการความคล่องตัวบนแนวสายสีเขียว",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "The Muve Kaset",
    station: "BTS เสนานิคม",
    transitType: "BTS",
    distance: "400 ม.",
    price: 11500,
    petFriendly: false,
    lifestyle: ["ราคาประหยัด", "เหมาะกับ WFH", "เป็นส่วนตัว"],
    desc: "คอนโดแนวคิดใหม่จากแสนสิริ ใกล้ BTS เสนานิคม และ ม.เกษตรศาสตร์ ออกแบบเพื่อคนทำงานรุ่นใหม่และนักศึกษา ฟังก์ชันห้องปรับเปลี่ยนได้ตามการใช้งาน พร้อมพื้นที่ทำงานสงบเงียบ",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Plum Condo Phaholyothin 89 (Khu Khot)",
    station: "BTS คูคต",
    transitType: "BTS",
    distance: "600 ม.",
    price: 6500,
    petFriendly: false,
    lifestyle: ["ราคาประหยัด", "เงียบสงบ"],
    desc: "คอนโดราคาประหยัดใกล้สถานีปลายทาง BTS คูคต ต้นสายสีเขียว นั่งยาวเข้าเมืองได้แบบไม่ต้องต่อสาย ห้องกว้าง บรรยากาศเงียบสงบ ที่จอดรถสะดวกสบาย งบประมาณเริ่มต้นเพียงหกพันบาท",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
  }
];

if (typeof window !== "undefined") {
  window.CONDO_DATASET = CONDO_DATASET;
}
