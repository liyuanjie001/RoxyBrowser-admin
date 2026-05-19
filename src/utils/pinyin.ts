// 极简拼音首字母提取：仅覆盖项目里出现过的常见姓氏 + 名字汉字。
// 未识别字符回退到 x，让序号兜底保持唯一。
const MAP: Record<string, string> = {
  // 姓氏 / 项目里出现过的字
  陈: 'c', 国: 'g', 栋: 'd',
  李: 'l', 思: 's', 雨: 'y',
  赵: 'z', 小: 'x', 峰: 'f',
  周: 'z', 明: 'm',
  孙: 's', 婷: 't',
  // 常见姓氏兜底
  张: 'z', 王: 'w', 刘: 'l', 杨: 'y', 黄: 'h', 吴: 'w', 徐: 'x', 朱: 'z',
  胡: 'h', 郭: 'g', 何: 'h', 高: 'g', 林: 'l', 罗: 'l', 郑: 'z', 梁: 'l',
  谢: 'x', 宋: 's', 唐: 't', 韩: 'h', 冯: 'f', 邓: 'd', 曹: 'c', 彭: 'p',
  曾: 'z', 萧: 'x', 田: 't', 董: 'd', 袁: 'y', 潘: 'p', 于: 'y', 蒋: 'j',
  蔡: 'c', 余: 'y', 杜: 'd', 叶: 'y', 程: 'c', 苏: 's', 魏: 'w', 吕: 'l',
  丁: 'd', 任: 'r', 沈: 's', 姚: 'y', 卢: 'l', 姜: 'j', 崔: 'c', 钟: 'z',
};

export function pinyinInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  let result = '';
  for (const ch of trimmed) {
    if (/[a-z]/i.test(ch)) {
      result += ch.toLowerCase();
    } else if (/[0-9]/.test(ch)) {
      result += ch;
    } else if (MAP[ch]) {
      result += MAP[ch];
    } else if (/\s/.test(ch)) {
      // 跳过空格
    } else {
      result += 'x';
    }
  }
  return result || 'x';
}
