import {copyFile, mkdir, readdir, readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const check = spawnSync(process.execPath, [path.join(root, 'scripts/build-content.mjs'), '--check'], {stdio:'inherit'});
if (check.status !== 0) throw new Error('内容包检查失败，请先重新生成。');

const catalog = JSON.parse(await readFile(path.join(root, 'content/catalog.json'), 'utf8'));
const files = [
  'index.html', 'styles.css', 'technical.css', 'app.js', 'content.generated.js', '.nojekyll',
  'assets/favicon.svg', 'assets/architecture.jpg', 'assets/barlow-condensed.woff2', 'assets/OFL.txt',
  'assets/source-han-sans-cn-vf.woff2', 'assets/source-han-sans-LICENSE.txt',
  ...['marked.min.js','purify.min.js','highlight.min.js','highlight.css','marked-LICENSE.txt','dompurify-LICENSE.txt','highlight-LICENSE.txt'].map(name => `assets/vendor/${name}`),
  'content/catalog.json',
  ...catalog.articles.map(article => `content/articles/${article.id}.md`),
  'content/references/langgraph-hitl-demo.md',
  'content/references/docx2md-tools.md',
  'content/references/llm-wiki-business.md',
  'content/references/deepagent-latency.md',
  'assets/deepagent/travel-waterfall.png', 'assets/deepagent/map-task.png',
  'scripts/build-content.mjs', 'scripts/build-site.mjs', 'README.md'
];
async function listFiles(dir, prefix = '') {
  const entries = await readdir(dir, {withFileTypes:true});
  const result = [];
  for (const entry of entries) {
    const rel = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(path.join(dir, entry.name), rel));
    else result.push(rel);
  }
  return result;
}
await mkdir(dist, {recursive:true});
const unexpected = (await listFiles(dist)).filter(file => !files.includes(file));
if (unexpected.length) throw new Error(`发布目录出现清单外文件：${unexpected.join(', ')}`);
for (const file of files) {
  await mkdir(path.dirname(path.join(dist, file)), {recursive:true});
  await copyFile(path.join(root, file), path.join(dist, file));
}
console.log(`已准备 GitHub Pages 根目录文件：${files.length} 个，输出到 dist/。`);
