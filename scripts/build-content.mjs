import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = JSON.parse(await readFile(path.join(root, 'content/catalog.json'), 'utf8'));
const ids = new Set();
const topics = new Set(catalog.topics.map(topic => topic.id));
const articles = [];
for (const entry of catalog.articles) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) || ids.has(entry.id)) {
    throw new Error(`文章标识不合法或重复：${entry.id}`);
  }
  ids.add(entry.id);
  if (!topics.has(entry.topic)) throw new Error(`未知专题：${entry.topic}`);
  for (const key of ['title', 'summary', 'category', 'date', 'scope']) {
    if (!entry[key]) throw new Error(`${entry.id} 缺少 ${key}`);
  }
  if (!Array.isArray(entry.tags) || !entry.tags.length || !entry.sources?.length) {
    throw new Error(`${entry.id} 缺少标签或来源`);
  }
  for (const source of entry.sources) {
    if (!source.path || /^(?:[a-z]:|\\\\|\/)/i.test(source.path) || source.path.includes('..')) {
      throw new Error(`${entry.id} 包含不适合公开的来源路径`);
    }
    if (!source.url?.startsWith('https://github.com/xiaocha653830-tech/')) {
      throw new Error(`${entry.id} 的来源没有可核对的 GitHub 地址`);
    }
  }
  const markdown = await readFile(path.join(root, 'content/articles', `${entry.id}.md`), 'utf8');
  if (/(?:[a-z]:\\\\|file:\/\/\/)/i.test(markdown)) throw new Error(`${entry.id} 的正文包含本机绝对路径`);
  const fences = markdown.match(/^```.*$/gm) || [];
  if (fences.length % 2) throw new Error(`${entry.id} 代码围栏未闭合`);
  if (!/^## /m.test(markdown)) throw new Error(`${entry.id} 缺少章节标题`);
  const charCount = markdown.replace(/```[\s\S]*?```/g, '').replace(/\s/g, '').length;
  articles.push({ ...entry, markdown, charCount, minutes: Math.max(2, Math.ceil(charCount / 350)) });
}
for (const group of [...catalog.topics, ...catalog.projects]) {
  for (const id of group.articles) {
    if (!ids.has(id)) throw new Error(`${group.id} 引用了不存在的文章 ${id}`);
  }
}
const data = { ...catalog, articles };
const output = `// 由 scripts/build-content.mjs 生成，请编辑 content/ 中的源文件。\nwindow.BLOG_CONTENT = ${JSON.stringify(data, null, 2).replace(/</g, '\\u003c')};\n`;
const target = path.join(root, 'content.generated.js');
if (process.argv.includes('--check')) {
  const existing = await readFile(target, 'utf8');
  if (existing !== output) throw new Error('内容包过期，请先运行 node scripts/build-content.mjs');
  console.log(`内容检查通过：${articles.length} 篇文章，${topics.size} 个专题。`);
} else {
  await writeFile(target, output, 'utf8');
  console.log(`已生成 ${articles.length} 篇文章；正文约 ${articles.reduce((sum, item) => sum + item.charCount, 0)} 字符。`);
}
