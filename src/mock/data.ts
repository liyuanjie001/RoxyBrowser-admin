import type { PromotionLink, RegisteredUser, SiteTraffic, Coupon, EndUser } from '@/types';
import type { User } from '@/auth/permissions';

export const mockUsers: User[] = [
  { id: 'u-ceo', name: '超级管理员', realName: '陈国栋', username: 'chengd', role: 'CEO' },
  { id: 'u-op', name: '管理员', realName: '李思雨', username: 'lisiyu', role: 'OPERATION' },
  { id: 'u-viewer', name: '查看者', realName: '周明', username: 'zhouming', role: 'VIEWER' },
  { id: 'u-sales-1', name: '电销/技术支持', realName: '赵小峰', username: 'zhaoxf', role: 'TELESALES' },
  { id: 'u-staff', name: '非运营内部人员', realName: '孙婷', username: 'sunting', role: 'NON_OPERATION' },
];

export const mockPromotionLinks: PromotionLink[] = [
  {
    id: 'pl-001',
    ownerId: 'u-op',
    ownerName: '李思雨',
    ownerUsername: 'bossaatest',
    name: '春季官网活动',
    code: 'SPRING25',
    inviteId: 'k7mp2x',
    url: 'https://roxybrowser.cn/invite/k7mp2x?utm_source=official_site&utm_medium=banner&utm_campaign=2026_q2_invite',
    channel: 'WEBSITE',
    utmSource: 'official_site',
    utmMedium: 'banner',
    utmCampaign: '2026_q2_invite',
    remark: '主推页',
    createdAt: '2026-04-01 10:20',
    visits: 12480,
    registrations: 824,
    payments: 196,
    revenue: 38420,
    identity: '高级合作伙伴',
    ownedUserCount: 102,
    subscriberCount: 9,
    totalRecharge: 104820,
    recharge30d: 66.97,
    withdrawable: 0,
    withdrawn: 746.09,
    linkType: 'Link C',
    rebateNonAgent: 15,
    rebateAgent: 10,
    userDiscount: 5,
    modified: true,
  },
  {
    id: 'pl-002',
    ownerId: 'u-op',
    ownerName: '李思雨',
    ownerUsername: 'bossggtest',
    name: '抖音种草',
    code: 'DY-ZS',
    inviteId: 'k7mp2x',
    url: 'https://roxybrowser.cn/invite/k7mp2x?utm_source=tiktok&utm_medium=video&utm_campaign=2026_q2_invite',
    channel: 'DOUYIN',
    utmSource: 'tiktok',
    utmMedium: 'video',
    utmCampaign: '2026_q2_invite',
    remark: '短视频投放',
    createdAt: '2026-04-08 14:11',
    visits: 8721,
    registrations: 612,
    payments: 138,
    revenue: 26930,
    identity: '新用户',
    ownedUserCount: 5,
    subscriberCount: 4,
    totalRecharge: 58.33,
    recharge30d: 21.28,
    withdrawable: 5.39,
    withdrawn: 0,
    linkType: 'Link C',
    rebateNonAgent: 15,
    rebateAgent: 10,
    userDiscount: 5,
    modified: false,
  },
  {
    id: 'pl-003',
    ownerId: 'u-sales-1',
    ownerName: '赵小峰',
    ownerUsername: 'LinuxDo占位号',
    name: '电销私域链接',
    code: 'TS-001',
    inviteId: 'b8tk4d',
    url: 'https://roxybrowser.cn/invite/b8tk4d?utm_source=wechat&utm_medium=private_msg&utm_campaign=normal&bd_code=bd_001',
    channel: 'WECHAT',
    utmSource: 'wechat',
    utmMedium: 'private_msg',
    utmCampaign: 'normal',
    bdCode: 'bd_001',
    remark: '私域池',
    createdAt: '2026-04-15 09:00',
    visits: 1340,
    registrations: 92,
    payments: 18,
    revenue: 3420,
    identity: '创始用户',
    ownedUserCount: 90,
    subscriberCount: null,
    totalRecharge: 0,
    recharge30d: 0,
    withdrawable: 0,
    withdrawn: 0,
    linkType: 'Link C',
    rebateNonAgent: 15,
    rebateAgent: 10,
    userDiscount: 5,
    modified: false,
  },
  {
    id: 'pl-004',
    ownerId: 'u-sales-1',
    ownerName: '赵小峰',
    ownerUsername: 'mrmoncif',
    name: '电销线索-A',
    code: 'TS-002',
    inviteId: 'b8tk4d',
    url: 'https://roxybrowser.cn/invite/b8tk4d?utm_source=wechat&utm_medium=group&utm_campaign=normal&bd_code=bd_001',
    channel: 'WECHAT',
    utmSource: 'wechat',
    utmMedium: 'group',
    utmCampaign: 'normal',
    bdCode: 'bd_001',
    remark: '',
    createdAt: '2026-04-20 11:30',
    visits: 980,
    registrations: 71,
    payments: 12,
    revenue: 2120,
    identity: '特邀用户',
    ownedUserCount: 8,
    subscriberCount: null,
    totalRecharge: 0,
    recharge30d: 0,
    withdrawable: 0,
    withdrawn: 0,
    linkType: 'Link C',
    rebateNonAgent: 15,
    rebateAgent: 10,
    userDiscount: 5,
    modified: true,
  },
  {
    id: 'pl-005',
    ownerId: 'u-ceo',
    ownerName: '陈国栋',
    ownerUsername: 'Unsold1078',
    name: '小红书联合推广',
    code: 'XHS-MAY',
    inviteId: 'd9hy5n',
    url: 'https://roxybrowser.cn/invite/d9hy5n?utm_source=xiaohongshu&utm_medium=post&utm_campaign=2026_may_kol',
    channel: 'XIAOHONGSHU',
    utmSource: 'xiaohongshu',
    utmMedium: 'post',
    utmCampaign: '2026_may_kol',
    createdAt: '2026-05-02 16:45',
    visits: 4120,
    registrations: 298,
    payments: 64,
    revenue: 12180,
    identity: '高级合作伙伴',
    ownedUserCount: 837,
    subscriberCount: null,
    totalRecharge: 0,
    recharge30d: 0,
    withdrawable: 0,
    withdrawn: 0,
    linkType: 'Link C',
    rebateNonAgent: 20,
    rebateAgent: 30,
    userDiscount: 10,
    modified: false,
  },
];

function buildMockEndUsers(): EndUser[] {
  // 列起头：图1/2 里截到的真实样例（ID 37950-37964），保证页面初始 12 行就是图中样子
  const fixed: EndUser[] = [
    { id: 37964, username: '7336pvQakX', email: null, phone: '18210177336', identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: null, promoterUsername: null },
    { id: 37963, username: '6354VliTfH', email: null, phone: '18023156354', identity: '新用户', discountPercent: 0, totalRecharge: 80, balance: 80, source: null, promoterUsername: null },
    { id: 37962, username: 'yjzyu', email: '2584260810@qq.com', phone: null, identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: 'github注册', promoterUsername: 'mrmoncif' },
    { id: 37961, username: '8394yBxjqZ', email: null, phone: '15072768394', identity: '新用户', discountPercent: 2.5, totalRecharge: 0, balance: 0, source: null, promoterUsername: 'bossaatest' },
    { id: 37960, username: 'WonCco', email: 'wenkew198@outlook.com', phone: null, identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: 'github注册', promoterUsername: 'LinuxDo占位号' },
    { id: 37959, username: 'makoichi1012', email: 'makoichi1012@gmail.com', phone: null, identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: '谷歌注册', promoterUsername: 'bossggtest' },
    { id: 37958, username: 'bossaatestviO', email: 'bossaatest@163.com', phone: null, identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: '直接注册', promoterUsername: 'bossaatest' },
    { id: 37957, username: '2667AfyaHe', email: null, phone: '17744652667', identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: null, promoterUsername: null },
    { id: 37956, username: '6238rMErhu', email: null, phone: '15034616238', identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: null, promoterUsername: 'mrmoncif' },
    { id: 37955, username: 'zyy19970321', email: 'zyy19970321@gmail.com', phone: null, identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: '谷歌注册', promoterUsername: null },
    { id: 37954, username: '1876019890test222', email: '1876019890test222@qq.com', phone: null, identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: '直接注册', promoterUsername: 'Unsold1078' },
    { id: 37953, username: '1876019890test111', email: '1876019890test111@qq.com', phone: null, identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: '直接注册', promoterUsername: 'Unsold1078' },
    { id: 37952, username: '2639nlvDyb', email: null, phone: '15879322639', identity: '新用户', discountPercent: 0, totalRecharge: 0, balance: 0, source: null, promoterUsername: null },
  ];

  // 再生成 37 条补足到 50 条；用确定性伪随机（基于 id 取模），保证不同字段分布
  const identities: EndUser['identity'][] = ['新用户', '特邀用户', '高级合作伙伴', '创始用户'];
  const sources: UserSource[] = [null, '直接注册', '谷歌注册', 'github注册'];
  const promoters = ['bossaatest', 'bossggtest', 'LinuxDo占位号', 'mrmoncif', 'Unsold1078', null];
  const usernameSeeds = ['Kyona', 'chainsawcat', 'adeii', '68iq8igm', '3826774787', 'kotaprl', 'mizukikj', 'sushi_lab', 'ren_x', 'pixxoh', 'koroda', 'akemi9', 'r0v_n', 'haru.dev', 'shio_2', 'kana_77', 'tanaka_t', 'okabe', 'mikoa', 'lyric_ko', 'nine_blue', 'rinka', 'opal', 'hatsu', 'shion', 'mochi9', 'yumi.r', 'sora77', 'nori_p', 'kabu', 'pekoy', 'eternal8', 'lumen', 'asagiri', 'nayuta', 'kuro2', 'rio'];

  const synthesized: EndUser[] = [];
  for (let i = 0; i < 37; i++) {
    const id = 37951 - i;
    const seed = i;
    const hasEmail = seed % 3 !== 0;
    const hasPhone = seed % 4 !== 1;
    const username = usernameSeeds[i % usernameSeeds.length];
    const identity = identities[seed % identities.length];
    const discount = seed % 5 === 0 ? 0 : [0, 0, 0, 2.5, 5, 10, 15][seed % 7];
    const totalRecharge = seed % 4 === 0 ? 0 : ((seed * 17) % 480) + 9;
    const balance = totalRecharge === 0 ? 0 : Math.round(totalRecharge * 0.4 * 100) / 100;
    const emailDomains = ['gmail.com', 'qq.com', '163.com', 'outlook.com', 'foxmail.com'];
    const email = hasEmail ? `${username.toLowerCase()}@${emailDomains[seed % emailDomains.length]}` : null;
    const phoneBase = 13000000000 + (id * 17) % 99999999;
    const phone = hasPhone ? String(phoneBase) : null;
    synthesized.push({
      id,
      username,
      email,
      phone,
      identity,
      discountPercent: discount,
      totalRecharge,
      balance,
      source: sources[seed % sources.length],
      promoterUsername: promoters[seed % promoters.length],
    });
  }

  return [...fixed, ...synthesized];
}

type UserSource = EndUser['source'];

export const mockEndUsers: EndUser[] = buildMockEndUsers();

export const mockRegisteredUsers: RegisteredUser[] = [
  { id: 'ru-001', phone: '13900000001', linkId: 'pl-001', registeredAt: '2026-05-10 09:21', paidAmount: 4 },
  { id: 'ru-002', phone: '13900000002', linkId: 'pl-001', registeredAt: '2026-05-10 11:08', paidAmount: null },
  { id: 'ru-003', phone: '13900000003', linkId: 'pl-002', registeredAt: '2026-05-11 13:45', paidAmount: 12 },
  { id: 'ru-004', phone: '13900000004', linkId: 'pl-003', registeredAt: '2026-05-11 15:30', paidAmount: null },
  { id: 'ru-005', phone: '13900000005', linkId: 'pl-003', registeredAt: '2026-05-12 08:50', paidAmount: 8 },
  { id: 'ru-006', phone: '13900000006', linkId: 'pl-004', registeredAt: '2026-05-12 10:14', paidAmount: null },
  { id: 'ru-007', phone: '13900000007', linkId: 'pl-005', registeredAt: '2026-05-12 14:22', paidAmount: 20 },
  { id: 'ru-008', phone: '13900000008', linkId: 'pl-002', registeredAt: '2026-05-13 09:11', paidAmount: 6 },
];

export const mockTraffic: SiteTraffic[] = [
  {
    site: 'COM',
    visits: 184320,
    registrations: 6420,
    sources: [
      { source: '搜索引擎', visits: 88410, percent: 48 },
      { source: '直接访问', visits: 42390, percent: 23 },
      { source: '社交媒体', visits: 31330, percent: 17 },
      { source: '外部推广链接', visits: 22190, percent: 12 },
    ],
  },
  {
    site: 'CN',
    visits: 96210,
    registrations: 3180,
    sources: [
      { source: '百度搜索', visits: 42330, percent: 44 },
      { source: '直接访问', visits: 19240, percent: 20 },
      { source: '微信生态', visits: 17320, percent: 18 },
      { source: '外部推广链接', visits: 17320, percent: 18 },
    ],
  },
];

export const mockCoupons: Coupon[] = [
  {
    id: 'cp-001',
    type: 'FULL_REDUCTION',
    name: '满 200 减 30',
    threshold: 200,
    amount: 30,
    validFrom: '2026-05-01',
    validTo: '2026-06-30',
    createdAt: '2026-04-25 14:00',
  },
  {
    id: 'cp-002',
    type: 'DISCOUNT',
    name: '8.5 折优惠券',
    discountPercent: 85,
    validFrom: '2026-05-10',
    validTo: '2026-05-31',
    createdAt: '2026-05-05 10:30',
  },
];
