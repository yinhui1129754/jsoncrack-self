const fs = require('fs');
const cheerio = require('cheerio');
const path = require("path")
const editorHtmlPath = path.join(process.cwd(), 'out', 'editor.html')
// 读取 HTML 文件
const html = fs.readFileSync(editorHtmlPath, 'utf8');

// 加载 HTML 并解析
const $ = cheerio.load(html);

// 提取 <head> 中的所有 <script> 标签并移除
const scripts = $('head script').remove();

// 将脚本插入到 <body> 的末尾（</body> 标签前）
$('body').append(scripts);

// 获取处理后的 HTML 字符串
const modifiedHtml = $.html({ decodeEntities: false });

// 写入输出文件
fs.writeFileSync(editorHtmlPath, modifiedHtml);

console.log('脚本已成功移动到 body 末尾！');