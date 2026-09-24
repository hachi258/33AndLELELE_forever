/* ============================================================
 *  data.js —— 全站内容配置文件
 *  ------------------------------------------------------------
 *  你只需要改这一个文件，整个网站的内容就会跟着变。
 *  改完保存 -> 刷新网页即可看到效果（不需要重新编译）。
 *  注意：请保留英文引号、逗号和花括号，不要删掉最后的分号。
 * ============================================================ */

window.COUPLE = {
  /* ---------- 1. 基本信息 ---------- */
  site: {
    title: '乐乐 和 33 的小屋',
    subtitle: '记录我们在一起的每一个普通日子',
    since: '2026-9-8', // 在一起的日期（影响首页「在一起第几天」）
    met: '2018-8-15', // 认识的日期
    footer: '乐乐 & 33 · 用喜欢的方式，过普通的日子'
  },

  /* ---------- 2. 两个人 ---------- */
  people: {
    a: { name: '乐乐', avatar: 'images/avatar-a.svg', tagline: '负责做饭' },
    b: { name: '33', avatar: 'images/avatar-b.svg', tagline: '负责拍照和好看' }
  },

  /* ---------- 3. 纪念日 ----------
   *  date 写成 MM-DD 表示每年重复；写成 YYYY-MM-DD 表示一次性。
   *  emoji 用任意 emoji 即可。
   */
  anniversaries: [
    { date: '2026-9-8', title: '在一起的纪念日', emoji: '💙', note: '每年都要认真过的日子' },
    { date: '2018', title: '我们认识的那天', note: '第一次说话，都很害羞' },
    { date: '02-9', title: '33 的生日', emoji: '🎂', note: '记得提前订蛋糕' },
    { date: '02-5', title: '乐乐的生日', emoji: '🎁', note: '他嘴上说不用买礼物' },
    { date: '2026-09-18', title: '第一次一起旅行', emoji: '🧳', note: '时隔3年两人再次会晤' }
  ],

  /* ---------- 4. 点点滴滴 · 时间轴 ----------
   *  tag 用来做筛选，可以自由取名，会自动生成筛选按钮。
   */
  timeline: [
    {
      date: '2023-9-9',
      title: '第一次在一起',
      tag: '纪念',
      text: '33高考完，小乐提出在一起',
    },
    {
      date: '2026-09-8',
      title: '第二次复合',
      tag: '纪念',
      text: '好艰难啊',
    },
    {
      date: '2026-09-18',
      title: '第一次一起旅行',
      tag: '旅行',
      text: '小乐坐了3个小时的高铁去南昌找33。',
      image: 'images/firstToNc.jpg'
    },
    
    {
      date: '2026-09-25',
      title: '第二次一起旅行',
      tag: '日常',
      text: '33想去合肥看演出，第一次两个人一起过中秋节。'
    },
  ],

  /* ---------- 5. 相册 ----------
   *  src 换成你自己的图片，比如 'images/我们的照片/001.jpg'
   *  category 会自动变成筛选按钮。
   */
  gallery: [
    { src: 'images/firstToNc.jpg', title: '第一次去南昌', date: '2026-09-18', category: '旅行' },
    { src: 'images/pingdou.jpg', title: '第一次拼豆', date: '2026-09-20', category: '日常' },
    { src: 'images/33_2.jpg', title: '33美照', date: '2025-01', category: '宝宝' },
    { src: 'images/p7.svg', title: '团子到家第一天', date: '2024-06-15', category: '宝宝' },
    { src: 'images/p8.svg', title: '一起看的第一场雪', date: '2025-01-12', category: '日常' },
    { src: 'images/p1.svg', title: '深夜的宵夜', date: '2024-03-08', category: '日常' },
    { src: 'images/p3.svg', title: '海边的小脚丫', date: '2023-08-16', category: '旅行' },
    { src: 'images/p5.svg', title: '一周年蛋糕', date: '2022-05-20', category: '纪念' },
    { src: 'images/p7.svg', title: '团子长大了', date: '2025-02-01', category: '宝宝' }
  ],

  /* ---------- 6. 去过的地方 · 足迹 ---------- */
  places: [
    {
      city: '南昌',
      region: '江西',
      date: '2026-09-18',
      cover: 'images/p2.svg',
      note: '第一次一起旅行，时隔多年再次见面，小乐很爱33。',
      //tags: ['第一次', '南昌之眼']
    },
    {
      city: '合肥',
      region: '安徽',
      date: '2022-04-05',
      cover: 'images/p6.svg',
      note: '还没开始呢',
    },

  ],

  /* ---------- 7. 首页轮播的情话 ---------- */
  quotes: [
    '你是小猪。',
    '乐乐乐爱33。'
  ]
};
