// src/data/projects.js

export const projects = {
  flood: {
    id: 'flood',
    emoji: '🌊', bg: 'bg-a', badge: '災害救援', badgeClass: 'badge-urgent', isReligion: false,
    title: '花蓮水災緊急救援物資', org: '台灣紅十字會',
    score: '94', aiDesc: '緊急度極高 · 影響人口 2,300+\n詐騙風險：極低 · 可信度：頂級',
    ds1: '2,300', ds2: '892', ds3: '3天',
    raised: 'NT$365,000', goal: '目標 NT$500,000', pct: '73', fill: '73%', donors: '892 人次捐款',
    desc: '花蓮縣受強颱侵襲，超過 2,300 名居民被迫撤離家園。本計畫緊急採購飲用水、食品包、禦寒衣物及醫療耗材，由當地 NGO 協同發放，所有款項通過智能合約鎖定。',
  },
  school: {
    id: 'school',
    emoji: '💻', bg: 'bg-c', badge: '教育', badgeClass: 'badge-new', isReligion: false,
    title: '偏鄉學童數位教育設備', org: '未來種子基金會',
    score: '87', aiDesc: '長期影響高 · 受益學童 480 人\n詐騙風險：極低 · 可信度：優良',
    ds1: '480', ds2: '341', ds3: '14天',
    raised: 'NT$135,000', goal: '目標 NT$300,000', pct: '45', fill: '45%', donors: '341 人次捐款',
    desc: '為台東、花蓮偏鄉 480 名學童提供平板電腦、網路設備及數位課程訂閱，縮短城鄉數位落差。本計畫與教育部合作，持續追蹤學習成效。',
  },
  elder: {
    id: 'elder',
    emoji: '❤️', bg: 'bg-d', badge: '老人關懷', badgeClass: '', isReligion: false,
    title: '獨居老人冬季送暖計畫', org: '台北市社會局',
    score: '79', aiDesc: '社會影響重要 · 受益長者 150 人\n詐騙風險：無 · 可信度：政府機構',
    ds1: '150', ds2: '89', ds3: '21天',
    raised: 'NT$24,000', goal: '目標 NT$200,000', pct: '12', fill: '12%', donors: '89 人次捐款',
    desc: '台北市 150 位獨居老人將在寒冬中面臨禦寒困難。本計畫提供保暖衣物組合、電熱毯、緊急聯絡設備及定期訪視服務，由社工師實地確認每份物資的送達。',
  },
  temple: {
    id: 'temple',
    emoji: '⛩️', bg: 'bg-d', badge: '宗教文化', badgeClass: '', isReligion: true,
    title: '大甲媽祖宮廟修繕工程', org: '大甲鎮瀾宮',
    score: '61', aiDesc: '⚠️ 宗教高風險類別 · 可信度：審核中\n需 DAO 投票通過 · 詐騙風險：中',
    ds1: '20,000', ds2: '203', ds3: '30天',
    raised: 'NT$140,000', goal: '目標 NT$500,000', pct: '28', fill: '28%', donors: '203 人次捐款',
    desc: '大甲鎮瀾宮為台灣重要文化資產，本次修繕工程包含主殿屋頂整修及防水處理。注意：本專案為宗教類高風險，每 NT$50,000 一個里程碑，需上傳實地照片方可解鎖。',
  },
};

export const tickerMessages = [
  '🔴 新偵測：台南地震災後心理援助需求',
  '⚠️ 更新：屏東暴雨農業損失評估完成',
  '🛡 攔截：宗教類偽造公文已凍結',
  '🟢 里程碑達成：花蓮救援物資已送達',
  '🆕 新上線：原住民文化保存計畫',
];

export const payMethodNames = {
  card: '信用卡', linepay: 'LINE Pay', jko: '街口支付',
  cvs: '超商繳費', atm: 'ATM轉帳', sms: '簡訊捐款',
  usdt: 'USDT', usdc: 'USDC', wallet: 'MetaMask',
};
