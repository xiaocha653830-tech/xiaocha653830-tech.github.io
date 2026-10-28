'use strict';

const content = window.BLOG_CONTENT;
const posts = [...content.articles].sort((a, b) => a.order - b.order);
const topics = content.topics;
const main = document.querySelector('#main');
const searchInput = document.querySelector('#site-search');
const nav = document.querySelector('#main-nav');
const menuButton = document.querySelector('.menu-button');
const progress = document.querySelector('#reading-progress');
const toast = document.querySelector('#toast');
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const formatDate = date => date.replaceAll('-', '.');
const articleURL = post => `#/post/${post.id}`;
const archiveURL = params => `#/archive${Object.keys(params).length ? '?' + new URLSearchParams(params) : ''}`;
const topicFor = post => topics.find(topic => topic.id === post.topic);
const tagHTML = post => `<span class="tag topic-${post.topic}">${escapeHTML(post.category)}</span><span class="tag tag-outline">${escapeHTML(post.kind)}</span>`;
const labelHTML = post => `<div class="tags">${tagHTML(post)}</div>`;
let lastPath = '';
let observer;
let toastTimer;
let storageWorks = true;
let savedIds;
try {
  const value = JSON.parse(localStorage.getItem('tech-blog:saved') || '[]');
  savedIds = new Set(Array.isArray(value) ? value.filter(id => posts.some(post => post.id === id)) : []);
} catch {
  savedIds = new Set();
  storageWorks = false;
}

function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
}

function getState() {
  const raw = location.hash.slice(1) || '/';
  const divider = raw.indexOf('?');
  return divider < 0
    ? { path: raw, params: new URLSearchParams() }
    : { path: raw.slice(0, divider), params: new URLSearchParams(raw.slice(divider + 1)) };
}

function updateFilter(key, value) {
  const { params } = getState();
  if (value) params.set(key, value); else params.delete(key);
  location.hash = `/archive${params.size ? '?' + params.toString() : ''}`;
}

function matchedText(text, query = '') {
  // 先分段、再转义，搜索字符串永远不会作为 HTML 使用。
  const terms = [...new Set(query.trim().split(/\s+/).filter(Boolean))];
  if (!terms.length) return escapeHTML(text);
  const expression = new RegExp(`(${terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return String(text).split(expression).map(part => terms.some(term => term.toLowerCase() === part.toLowerCase())
    ? `<mark>${escapeHTML(part)}</mark>` : escapeHTML(part)).join('');
}

function articleRow(post, query = '') {
  return `<a class="archive-item" href="${articleURL(post)}"><div class="post-meta">${labelHTML(post)}<span class="date">${formatDate(post.date)}</span></div><h2>${matchedText(post.title, query)}</h2><p>${matchedText(post.summary, query)}</p><div class="archive-item-bottom"><span>${post.level} / 约 ${post.minutes} 分钟</span><span>${savedIds.has(post.id) ? '已收藏 · ' : ''}阅读全文 ↗</span></div></a>`;
}

function homePage() {
  return `<section class="hero tech-hero" aria-label="技术博客首页"><img class="hero-image" src="./assets/architecture.jpg" alt="" width="1000" height="1500" fetchpriority="high"><div class="hero-intro"><p class="hero-caption">源码 / 实践 / 方法<br>一个开发者的技术记录</p><div class="hero-statement"><h1 class="hero-title">在场。</h1><div class="hero-bottom"><span class="latin">Notes from the code</span><span class="short-line"></span><span>${posts.length} 篇文章 / ${topics.length} 个专题</span></div></div></div><div class="hero-journal"><div class="hero-journal-heading"><span>精选文章</span><span class="latin">From notes to practice / 2026</span></div>${posts.slice(0, 4).map(post => `<a class="hero-post" href="${articleURL(post)}"><div class="post-meta"><span class="date">${formatDate(post.date)}</span>${labelHTML(post)}</div><h2>${escapeHTML(post.title)}</h2></a>`).join('')}<a class="all-posts" href="#/archive"><span>翻阅全部文章 <span class="latin">(${String(posts.length).padStart(2, '0')})</span></span><span>↗</span></a></div></section><section class="section"><div class="section-head"><h2>沿着问题阅读 <span class="latin">Reading paths</span></h2><a href="#/topics">全部专题 ↗</a></div><div class="topic-preview">${topics.map(topic => `<a class="topic-preview-item" href="#/topics/${topic.id}"><span class="topic-symbol topic-${topic.id}" aria-hidden="true">${topic.symbol}</span><div><h3>${topic.name}</h3><p>${topic.description}</p><span class="topic-meta">${topic.articles.length} 篇文章 <span class="latin">${topic.english}</span></span></div><span aria-hidden="true">↗</span></a>`).join('')}</div></section><section class="home-note"><div class="note-label"><span class="latin">Read. Build. Reflect.</span></div><div><blockquote>从一个具体的问题开始，<br>走到可以解释的实现。</blockquote></div></section>`;
}

function filteredArticles(params) {
  const query = (params.get('q') || '').trim().toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const category = params.get('category') || '';
  const tag = params.get('tag') || '';
  const onlySaved = params.get('saved') === '1';
  const selected = posts.filter(post => {
    const haystack = [post.title, post.summary, post.category, post.kind, ...post.tags, post.markdown].join(' ').toLowerCase();
    return (!category || post.topic === category) && (!tag || post.tags.includes(tag)) && (!onlySaved || savedIds.has(post.id)) && terms.every(term => haystack.includes(term));
  });
  const sort = params.get('sort');
  return selected.sort((a, b) => sort === 'reading' ? a.minutes - b.minutes || a.order - b.order : sort === 'oldest' ? a.date.localeCompare(b.date) || b.order - a.order : b.date.localeCompare(a.date) || a.order - b.order);
}

function archivePage(params) {
  const query = params.get('q') || '';
  const selected = filteredArticles(params);
  const category = params.get('category') || '';
  const tag = params.get('tag') || '';
  const onlySaved = params.get('saved') === '1';
  const allTags = [...new Set(posts.flatMap(post => post.tags))].sort((a, b) => a.localeCompare(b));
  return `<section class="page-heading"><h1>技术，持续记录。<span class="latin">Engineering journal</span></h1></section><div class="archive-toolbar"><div class="filter-group" role="group" aria-label="文章分类"><button class="filter-button" data-filter="" aria-pressed="${!category}">全部 <span class="filter-count">${posts.length}</span></button>${topics.map(topic => `<button class="filter-button" data-filter="${topic.id}" aria-pressed="${category === topic.id}">${topic.name}<span class="filter-count">${topic.articles.length}</span></button>`).join('')}</div><div class="archive-options"><button class="saved-filter" data-saved-filter aria-pressed="${onlySaved}">${onlySaved ? '■' : '□'} 只看收藏 (${savedIds.size})</button><label class="sort-label">排序<select id="sort-order"><option value="newest" ${!params.get('sort') || params.get('sort') === 'newest' ? 'selected' : ''}>最新整理</option><option value="oldest" ${params.get('sort') === 'oldest' ? 'selected' : ''}>最早整理</option><option value="reading" ${params.get('sort') === 'reading' ? 'selected' : ''}>阅读时长</option></select></label></div></div><div class="active-filters" role="status"><span>找到 ${selected.length} 篇文章${query ? ` · 搜索“${escapeHTML(query)}”` : ''}${tag ? ` · 标签 ${escapeHTML(tag)}` : ''}</span>${query || category || tag || onlySaved ? '<a href="#/archive">清除全部条件 ×</a>' : '<span>标题、标签与正文均可搜索</span>'}</div><div class="archive-layout"><aside class="archive-aside"><span class="latin">2026</span><p>从实践中积累，按主题归档。</p><div class="tag-cloud" aria-label="技术标签">${allTags.map(item => `<a href="${escapeHTML(archiveURL({tag:item}))}" class="${tag === item ? 'selected' : ''}">${escapeHTML(item)}</a>`).join('')}</div><p class="saved-hint">收藏仅保存在当前浏览器。</p></aside><div class="article-results">${selected.length ? selected.map(post => articleRow(post, query)).join('') : `<div class="empty-state"><h2>${onlySaved ? '这里还没有符合条件的收藏。' : '没有找到匹配的文章。'}</h2><p>试试 RAG、LangGraph、编码或 Outbox，<br>也可以清除分类与标签后重新搜索。</p><a href="#/archive">查看全部文章 ↗</a></div>`}</div></div>`;
}

function topicPage(id) {
  const topic = topics.find(item => item.id === id);
  if (id && !topic) return notFound();
  if (topic) return `<div class="breadcrumb"><a href="#/topics">技术专题</a><span>/</span><span>${topic.name}</span></div><section class="page-heading"><h1>${topic.name}<span class="latin">${topic.english}</span></h1></section><section class="reading-path">${topic.articles.map((articleId, index) => {const post = posts.find(item => item.id === articleId);return `<div class="reading-step"><span class="step-number latin">${String(index + 1).padStart(2, '0')}</span>${articleRow(post)}</div>`;}).join('')}</section>`;
  return `<section class="page-heading"><h1>沿着问题，深入。<span class="latin">Topics & reading paths</span></h1></section><section class="topic-list">${topics.map(item => `<a href="#/topics/${item.id}" class="topic-detail"><div><span class="topic-symbol topic-${item.id}">${item.symbol}</span><h2>${item.name}</h2><span class="latin">${item.english}</span></div><div><p>${item.description}</p><span>${item.articles.length} 篇 / ${item.articles.reduce((sum, articleId) => sum + posts.find(post => post.id === articleId).minutes, 0)} 分钟阅读</span><span class="topic-open">进入专题 ↗</span></div></a>`).join('')}</section>`;
}

function projectsPage() {
  return `<section class="page-heading"><h1>在项目里，理解。<span class="latin">Projects & fieldwork</span></h1></section><section class="projects-list">${content.projects.map(project => `<article class="project-entry"><div><span class="project-status">${project.status}</span><h2>${escapeHTML(project.name)}</h2><a class="project-path" href="${escapeHTML(project.path)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.path.replace('https://github.com/', ''))} ↗</a><div class="stack-tags">${project.stack.map(item => `<span>${escapeHTML(item)}</span>`).join('')}</div></div><div><p class="project-description">${project.description}</p><div class="project-articles">${project.articles.map(id => {const post = posts.find(item => item.id === id);return `<a href="${articleURL(post)}">${escapeHTML(post.title)}<span>↗</span></a>`;}).join('')}</div></div></article>`).join('')}</section>`;
}

function markdownHTML(markdown) {
  if (!window.marked || !window.DOMPurify) return `<pre class="markdown-fallback">${escapeHTML(markdown)}</pre>`;
  return DOMPurify.sanitize(marked.parse(markdown, {gfm:true, breaks:false}), {
    ALLOWED_TAGS:['p','h2','h3','h4','ul','ol','li','a','pre','code','blockquote','strong','em','del','table','thead','tbody','tr','th','td','hr','br','img','div'],
    ALLOWED_ATTR:['href','title','class','start','align','src','alt','width','height','loading','decoding']
  });
}

function articlePage(post) {
  const topic = topicFor(post);
  const related = posts.filter(item => item.id !== post.id && item.topic === post.topic);
  const next = related[0] || posts[(posts.indexOf(post) + 1) % posts.length];
  return `<div class="breadcrumb"><a href="#/archive">技术文章</a><span>/</span><a href="#/topics/${post.topic}">${post.category}</a></div><article class="technical-article"><header class="article-heading">${labelHTML(post)}<h1>${escapeHTML(post.title)}</h1><p class="article-summary">${escapeHTML(post.summary)}</p><div class="article-meta"><time datetime="${post.date}">整理于 ${formatDate(post.date)}</time><span>${post.charCount.toLocaleString()} 字符</span><span>约 ${post.minutes} 分钟</span><span>${post.level}</span></div><div class="article-actions"><button data-bookmark="${post.id}" aria-pressed="${savedIds.has(post.id)}">${savedIds.has(post.id) ? '已收藏 ✓' : '收藏文章 +'}</button><button data-download="${post.id}">下载 Markdown ↓</button><button data-copy-link>复制文章链接 ↗</button></div></header><div class="article-layout"><aside class="article-sidebar"><nav class="toc" aria-label="文章目录"><h2>本文目录</h2><div id="toc-links"></div></nav><a href="#/topics/${topic.id}">专题：${topic.name} ↗</a><a href="#/archive">← 返回文章档案</a></aside><div class="article-content-column"><div class="evidence-note"><span>${post.status}</span><p>${escapeHTML(post.scope)}</p></div><div class="article-body markdown-body">${markdownHTML(post.markdown)}</div><section class="source-panel" aria-label="资料来源"><h2>资料与代码依据</h2><p>链接指向已核对的 GitHub 仓库文件；未单独公开的演示摘录收录在本博客项目内。</p>${post.sources.map(source => `<a class="source-link" href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer"><span>${escapeHTML(source.repository)} / ${escapeHTML(source.path)}<small>L${source.start}–L${source.end}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</section><div class="article-tag-links">${post.tags.map(tag => `<a href="${escapeHTML(archiveURL({tag}))}"># ${escapeHTML(tag)}</a>`).join('')}</div></div></div></article><a class="next-article" href="${articleURL(next)}"><span>继续阅读 <span>↗</span></span><h2>${escapeHTML(next.title)}</h2></a>`;
}

function aboutPage() {
  return `<section class="page-heading"><h1>在场，持续构建。<span class="latin">Notes from the code</span></h1></section><section class="about-layout tech-about"><div class="about-manifesto"><span class="latin">Read the source.<br>Trace the data.<br>Explain the trade-offs.</span><p>读源码，追数据，讲取舍。</p></div><div class="about-copy"><h2>记录能被解释的实现，<br>也记录尚未解决的问题。</h2><p>「在场」关注 RAG 检索、Agent 工作流、数据工程与 Python 工具。文章从学习笔记与项目代码出发，围绕具体问题组织，而不是堆叠概念。</p><p>每篇文章保留来源和核对范围：哪些来自实际源码，哪些是历史故障记录，哪些是尚待实现的建议。代码会变化，文章也应当跟着修订。</p><div class="about-topics">${topics.map(topic => `<a class="tag topic-${topic.id}" href="#/topics/${topic.id}">${topic.name}</a>`).join('')}</div><a class="footer-link" href="#/projects">查看项目与相关文章 <span>↗</span></a><p class="small">首批 8 篇文章整理于 2026 年 10 月 20 日。部分资料来自课程笔记和既有草稿，已重新组织并对照当前本地源码核查，不代表来源项目已经完整验收。</p></div></section>`;
}

function notFound() {
  return `<section class="page-heading"><h1>没有找到这一页。</h1><p>文章可能已更名，或链接不完整。<br><a href="#/archive">返回文章档案 ↗</a></p></section>`;
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航');
  nav.classList.remove('expanded');
}

async function copyText(value, button) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    notify('已复制');
  } catch {
    const input = document.createElement('textarea');
    input.value = value;
    input.className = 'clipboard-helper';
    input.setAttribute('readonly', '');
    document.body.append(input);
    input.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* 保留手动复制提示 */ }
    input.remove();
    button?.focus({preventScroll:true});
    if (copied) notify('已复制');
    else {
      const target = button?.closest('.code-block')?.querySelector('code');
      if (target) { const range = document.createRange(); range.selectNodeContents(target); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); }
      notify(target ? '浏览器未允许复制，已选中代码，请按 Ctrl+C' : '浏览器未允许复制，请从地址栏复制链接');
    }
  }
}

function setupArticle(post, params) {
  const body = main.querySelector('.article-body');
  const headings = [...body.querySelectorAll('h2,h3')];
  headings.forEach((heading, index) => {heading.id = `section-${index + 1}`; heading.tabIndex = -1;});
  const toc = document.querySelector('#toc-links');
  toc.innerHTML = headings.map(heading => `<a href="${articleURL(post)}?section=${heading.id}" data-section="${heading.id}" class="${heading.tagName === 'H3' ? 'toc-child' : ''}">${escapeHTML(heading.textContent)}</a>`).join('');
  toc.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    history.replaceState(null, '', link.getAttribute('href'));
    jumpToSection(link.dataset.section);
  }));
  body.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (/^https?:\/\//i.test(href)) {link.target = '_blank';link.rel = 'noopener noreferrer';}
    else if (!href.startsWith('#/')) link.removeAttribute('href');
  });
  body.querySelectorAll('pre > code').forEach(code => {
    const pre = code.parentElement;
    const container = document.createElement('div');
    container.className = 'code-block';
    const language = code.className.match(/language-([\w+-]+)/)?.[1] || 'text';
    const bar = document.createElement('div');
    bar.className = 'code-toolbar';
    const label = document.createElement('span');
    label.textContent = language;
    const button = document.createElement('button');
    button.type = 'button';button.textContent = '复制代码';
    button.setAttribute('aria-label', `复制 ${language} 代码`);
    const rawCode = code.textContent;
    button.addEventListener('click', () => copyText(rawCode, button));
    bar.append(label, button);
    pre.before(container);container.append(bar, pre);
    if (window.hljs && hljs.getLanguage(language)) hljs.highlightElement(code);
  });
  body.querySelectorAll('table').forEach(table => {
    const wrapper = document.createElement('div');wrapper.className = 'table-scroll';wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');wrapper.setAttribute('aria-label', '可横向滚动的表格');
    table.before(wrapper);wrapper.append(table);
  });
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      const id = visible[0].target.id;
      toc.querySelectorAll('a').forEach(link => {
        if (link.dataset.section === id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin:'-5% 0px -65% 0px'});
    headings.forEach(heading => observer.observe(heading));
  }
  const section = params.get('section');
  if (section) requestAnimationFrame(() => jumpToSection(section));
}

function jumpToSection(id) {
  const target = document.getElementById(id);
  if (!target || !target.closest('.article-body')) return;
  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
  target.focus({preventScroll:true});
}

function downloadArticle(post) {
  const sourceNotes = post.sources.map(source => `- ${source.url}`).join('\n');
  const text = `# ${post.title}\n\n> 整理于 ${post.date} · ${post.category}\n\n${post.summary}\n\n核对范围：${post.scope}\n\n${post.markdown}\n\n## 资料与代码依据\n\n${sourceNotes}\n`;
  const url = URL.createObjectURL(new Blob([text], {type:'text/markdown;charset=utf-8'}));
  const link = document.createElement('a');link.href = url;link.download = `${post.id}.md`;
  document.body.append(link);link.click();link.remove();setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify('已生成 Markdown 下载');
}

function render() {
  const focusedFilter = document.activeElement?.getAttribute('data-filter');
  const focusedSort = document.activeElement?.id === 'sort-order';
  const focusedSaved = document.activeElement?.hasAttribute('data-saved-filter');
  observer?.disconnect();
  const {path, params} = getState();
  let page = 'home';
  let title = '在场 Tech Notes — 技术博客';
  let activePost;
  if (path === '/') main.innerHTML = homePage();
  else if (path === '/archive') {page = 'archive';title = '技术文章 — 在场';main.innerHTML = archivePage(params);}
  else if (path === '/topics' || path.startsWith('/topics/')) {page = 'topics';title = '技术专题 — 在场';main.innerHTML = topicPage(path.split('/')[2]);}
  else if (path === '/projects') {page = 'projects';title = '项目实践 — 在场';main.innerHTML = projectsPage();}
  else if (path === '/about') {page = 'about';title = '关于 — 在场';main.innerHTML = aboutPage();}
  else if (path.startsWith('/post/')) {
    page = 'archive';activePost = posts.find(post => post.id === path.slice(6));
    title = activePost ? `${activePost.title} — 在场` : '文章未找到 — 在场';
    main.innerHTML = activePost ? articlePage(activePost) : notFound();
  } else {title = '页面未找到 — 在场';main.innerHTML = notFound();}
  document.title = title;
  document.body.classList.toggle('reading-article', Boolean(activePost));
  progress.hidden = !activePost;
  nav.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');else link.removeAttribute('aria-current');
  });
  searchInput.value = params.get('q') || '';
  main.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => updateFilter('category', button.dataset.filter)));
  main.querySelector('#sort-order')?.addEventListener('change', event => updateFilter('sort', event.target.value));
  main.querySelector('[data-saved-filter]')?.addEventListener('click', () => updateFilter('saved', params.get('saved') === '1' ? '' : '1'));
  main.querySelector('[data-bookmark]')?.addEventListener('click', event => {
    const button = event.currentTarget;const id = button.dataset.bookmark;
    if (savedIds.has(id)) savedIds.delete(id);else savedIds.add(id);
    try {localStorage.setItem('tech-blog:saved', JSON.stringify([...savedIds]));storageWorks = true;} catch {storageWorks = false;}
    button.setAttribute('aria-pressed', String(savedIds.has(id)));
    button.textContent = savedIds.has(id) ? '已收藏 ✓' : '收藏文章 +';
    notify(storageWorks ? (savedIds.has(id) ? '已收藏到当前浏览器' : '已取消收藏') : '浏览器存储不可用，本次页面内暂存');
  });
  main.querySelector('[data-download]')?.addEventListener('click', () => downloadArticle(activePost));
  main.querySelector('[data-copy-link]')?.addEventListener('click', event => copyText(location.href, event.currentTarget));
  if (activePost) setupArticle(activePost, params);
  closeMenu();
  if (path !== lastPath) {window.scrollTo({top:0, behavior:'instant'});if (lastPath) main.focus({preventScroll:true});}
  else if (focusedFilter !== null && focusedFilter !== undefined) [...main.querySelectorAll('[data-filter]')].find(button => button.dataset.filter === focusedFilter)?.focus({preventScroll:true});
  else if (focusedSort) main.querySelector('#sort-order')?.focus({preventScroll:true});
  else if (focusedSaved) main.querySelector('[data-saved-filter]')?.focus({preventScroll:true});
  lastPath = path;
  updateProgress();
}

function updateProgress() {
  if (progress.hidden) return;
  const article = main.querySelector('.article-body');
  if (!article) return;
  const rect = article.getBoundingClientRect();
  const total = Math.max(1, rect.height - innerHeight);
  const percent = Math.max(0, Math.min(100, Math.round(-rect.top / total * 100)));
  progress.style.setProperty('--progress', `${percent}%`);
  progress.setAttribute('aria-valuenow', String(percent));
}

searchInput.maxLength = 160;
document.querySelector('.search-form').addEventListener('submit', event => {
  event.preventDefault();const query = searchInput.value.trim();location.hash = archiveURL(query ? {q:query} : {}).slice(1);
});
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));menuButton.setAttribute('aria-label', expanded ? '打开导航' : '收起导航');nav.classList.toggle('expanded', !expanded);
});
document.addEventListener('keydown', event => {if (event.key === 'Escape') closeMenu();});
document.querySelector('.skip-link').addEventListener('click', event => {event.preventDefault();main.focus();main.scrollIntoView({block:'start'});});
document.querySelector('#back-top').addEventListener('click', () => window.scrollTo({top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
window.addEventListener('hashchange', render);
window.addEventListener('scroll', updateProgress, {passive:true});
window.addEventListener('resize', updateProgress);
render();
