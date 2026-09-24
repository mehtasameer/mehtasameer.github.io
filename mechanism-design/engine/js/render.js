// engine/js/render.js — Reveal.js edition
// Markdown files stay simple (#/##/### headings).
// This script parses them and builds Reveal.js <section> elements.

// ── Markdown loading ──────────────────────────────────────────────────────────

async function loadMarkdown() {
  const slides  = document.querySelector('.slides');
  const source  = slides?.dataset.markdown;
  const fallback = document.getElementById('deck-markdown');

  if (window.location.protocol === 'file:' && fallback) return fallback.textContent.trim();
  if (!source) {
    if (fallback) return fallback.textContent.trim();
    throw new Error('No Markdown source configured.');
  }
  try {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Could not load ${source}: ${res.status}`);
    return res.text();
  } catch {
    if (fallback) return fallback.textContent.trim();
    throw new Error(`Could not load ${source}.`);
  }
}

// ── DOM helpers ───────────────────────────────────────────────────────────────

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function markdownHtml(md = '') {
  return window.marked ? window.marked.parse(md, { gfm: true, breaks: false }) : md;
}

function inlineMarkdownHtml(md = '') {
  return window.marked ? window.marked.parseInline(md, { gfm: true, breaks: false }) : md;
}

function loadStylesheetOnce(href) {
  if ([...document.styleSheets].some(sheet => sheet.href === href)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function loadScriptOnce(src) {
  const existing = [...document.scripts].find(script => script.src === src);
  if (existing) {
    if (existing.dataset.loaded === 'true') return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

async function ensureKatex() {
  const base = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist';
  loadStylesheetOnce(`${base}/katex.min.css`);
  if (!window.katex) await loadScriptOnce(`${base}/katex.min.js`);
  if (!window.renderMathInElement) await loadScriptOnce(`${base}/contrib/auto-render.min.js`);
}

async function renderMath(root) {
  try {
    await ensureKatex();
    if (!window.renderMathInElement) return;
    window.renderMathInElement(root, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
    });
  } catch (error) {
    console.warn('Math rendering failed; leaving TeX source visible.', error);
  }
}

function protectMath(md) {
  const blocks = [];
  let idx = 0;
  md = md.replace(/\$\$([\s\S]*?)\$\$/g, (_, content) => {
    blocks.push({ type: 'display', content });
    return '\x01MATH' + (idx++) + '\x01';
  });
  md = md.replace(/\$([^$]+?)\$/g, (_, content) => {
    blocks.push({ type: 'inline', content });
    return '\x01MATH' + (idx++) + '\x01';
  });
  return { text: md, blocks };
}

function restoreMath(html, blocks) {
  for (let i = 0; i < blocks.length; i++) {
    const marker = '\x01MATH' + i + '\x01';
    const replacement = blocks[i].type === 'display'
      ? '$$' + blocks[i].content + '$$'
      : '$' + blocks[i].content + '$';
    html = html.split(marker).join(replacement);
  }
  return html;
}

function renderMarkdownBlock(md, cls = 'markdown-block') {
  const node = el('div', cls);
  const processed = md.replace(/^(\s*)-\*\s+/gm, '$1- \x01FRAG\x01 ');
  const { text: protectedMd, blocks: mathBlocks } = protectMath(processed);
  node.innerHTML = markdownHtml(protectedMd);
  node.innerHTML = restoreMath(node.innerHTML, mathBlocks);
  node.querySelectorAll('li').forEach(li => {
    const probe = li.querySelector('p') || li;
    const first = probe.firstChild;
    if (first && first.nodeType === Node.TEXT_NODE && first.textContent.startsWith('\x01FRAG\x01 ')) {
      li.classList.add('fragment');
      first.textContent = first.textContent.slice('\x01FRAG\x01 '.length);
    }
  });
  return node;
}

// ── Markdown parsing helpers ──────────────────────────────────────────────────

function headingText(line, level) {
  return line.replace(new RegExp(`^${'#'.repeat(level)}\\s+`), '').trim();
}

function isSectionHeading(line) { return /^##\s+/.test(line) && !/^###/.test(line); }
function isSlideHeading(line)   { return /^###\s+/.test(line); }
function isHeading(line, level) { return new RegExp(`^${'#'.repeat(level)}\\s+`).test(line); }
function isBullet(line)         { return /^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line); }
function isEmptyBullet(line)    { return /^\s*[-*+]\s*$/.test(line) || /^\s*\d+\.\s*$/.test(line); }

function nextNonEmpty(lines, start) {
  for (let i = start; i < lines.length; i++) if (lines[i].trim()) return lines[i];
  return '';
}

function ensureRoundedMermaid(code) {
  if (!/^\s*flowchart\s+/m.test(code) || /classDef\s+default\b/.test(code)) return code;
  return `${code.trimEnd()}\n  classDef default rx:8,ry:8;`;
}

function extractMermaid(md) {
  const m = md.match(/```mermaid\s*\n([\s\S]*?)```/);
  return m ? ensureRoundedMermaid(m[1].trim()) : '';
}

function extractGraphviz(md) {
  const m = md.match(/```(?:graphviz|dot)\s*\n([\s\S]*?)```/);
  return m ? m[1].trim() : '';
}

function htmlEscape(s = '') {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function dotQuote(s = '') {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function treeHtmlLabel(title, subtitle = '') {
  const main = htmlEscape(title.trim());
  const sub  = htmlEscape(subtitle.trim());
  return sub
    ? `<<B>${main}</B><BR/><FONT POINT-SIZE="20">${sub}</FONT>>`
    : `<<B>${main}</B>>`;
}

function leafHtmlLabel(label) {
  const words = label.trim().split(/\s+/);
  if (label.includes(' / ')) {
    return `<${htmlEscape(label).replace(' / ', ' /<BR/>')}>`;
  }
  if (words.length >= 4) {
    const split = Math.ceil(words.length / 2);
    return `<${htmlEscape(words.slice(0, split).join(' '))}<BR/>${htmlEscape(words.slice(split).join(' '))}>`;
  }
  if (words.length === 3) {
    return `<${htmlEscape(words.slice(0, 2).join(' '))}<BR/>${htmlEscape(words.slice(2).join(' '))}>`;
  }
  return dotQuote(label.trim());
}

function parseTreeNodeText(text) {
  const [nodeText, leafText = ''] = text.split(/\s*->\s*/, 2);
  const [title, subtitle = ''] = nodeText.split(/\s*\|\s*/, 2);
  return { title: title.trim(), subtitle: subtitle.trim(), leafText: leafText.trim() };
}

function treeBlockToGraphviz(code) {
  const root = { id: 'root', children: [], depth: -1 };
  const stack = [root];
  let nextId = 1;

  code.split('\n').forEach(line => {
    if (!line.trim()) return;
    const indent = line.match(/^\s*/)[0].length;
    const depth = Math.floor(indent / 2);
    const parsed = parseTreeNodeText(line.trim());
    if (!parsed.title) return;

    const node = {
      id: `n${nextId++}`,
      leafId: parsed.leafText ? `n${nextId++}` : '',
      ...parsed,
      children: [],
      depth,
    };

    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    const parent = stack[stack.length - 1] || root;
    parent.children.push(node);
    stack.push(node);
  });

  const nodes = [];
  const leaves = [];
  const junctions = [];
  const edges = [];
  const ranks = new Map();

  function addRank(depth, id) {
    if (!ranks.has(depth)) ranks.set(depth, []);
    ranks.get(depth).push(id);
  }

  function walk(node, parent = null) {
    if (node !== root) {
      const group = node.children.length === 2 && node.depth >= 2 ? `, group=${node.id}` : '';
      nodes.push(`  ${node.id} [${group ? group.slice(2) + ', ' : ''}label=${treeHtmlLabel(node.title, node.subtitle)}];`);
      addRank(node.depth, node.id);
      if (parent) edges.push(`  ${parent.id} -> ${node.id};`);
    }

    const useJunction = node !== root && node.children.length === 2 && node.depth >= 2;
    if (useJunction) {
      const junctionId = `${node.id}j`;
      junctions.push(`  ${junctionId} [group=${node.id}];`);
      addRank(node.depth + 0.5, junctionId);
      edges.push(`  ${node.id}:s -> ${junctionId}:n [arrowhead=none, weight=100];`);
      edges.push(`  ${junctionId}:w -> ${node.children[0].id}:n;`);
      edges.push(`  ${junctionId}:e -> ${node.children[1].id}:n;`);
      node.children.forEach(child => walk(child, null));
    } else {
      node.children.forEach(child => walk(child, node === root ? null : node));
    }

    if (node.leafText) {
      leaves.push(`  ${node.leafId} [label=${leafHtmlLabel(node.leafText)}];`);
      addRank(node.depth + 1, node.leafId);
      edges.push(`  ${node.id}:s -> ${node.leafId}:n;`);
    }
  }

  root.children.forEach(child => walk(child));

  const rankLines = [...ranks.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, ids]) => `  { rank=same; ${ids.join('; ')}; }`);

  return `digraph Tree {
  graph [
    rankdir=TB,
    bgcolor="transparent",
    pad=0.12,
    nodesep=0.68,
    ranksep=0.62,
    splines=ortho
  ];

  node [
    shape=box,
    style="rounded",
    color="#2457a6",
    penwidth=1.2,
    fontname="EB Garamond",
    fontsize=27,
    margin="0.26,0.15",
    width=3.02,
    height=0.80
  ];

  edge [
    color="#2457a6",
    penwidth=1.2,
    arrowsize=0.55,
    tailport=s,
    headport=n
  ];

${nodes.join('\n')}

  node [
    shape=point,
    width=0.01,
    height=0.01,
    label="",
    color="transparent",
    fixedsize=true
  ];

${junctions.join('\n')}

  node [
    shape=box,
    style="",
    color="transparent",
    fontname="EB Garamond",
    fontsize=21,
    margin="0.08,0.08",
    width=2.20,
    height=0.58
  ];

${leaves.join('\n')}

${edges.join('\n')}

${rankLines.join('\n')}
}`;
}

function extractTree(md) {
  const m = md.match(/```tree\s*\n([\s\S]*?)```/);
  return m ? treeBlockToGraphviz(m[1].trim()) : '';
}

function bulletItems(lines) {
  return lines.filter(isBullet).map(l => l.replace(/^\s*(?:[-*+]|\d+\.)\s+/, '').trim());
}

function parseTwoColumn(raw) {
  const lines = raw.split('\n');
  const li = lines.findIndex(l => /^Left:\s*/i.test(l.trim()));
  const ri = lines.findIndex(l => /^Right:\s*/i.test(l.trim()));
  if (li < 0 || ri < 0 || ri <= li) return null;
  return {
    leftTitle:  lines[li].replace(/^Left:\s*/i, '').trim(),
    rightTitle: lines[ri].replace(/^Right:\s*/i, '').trim(),
    left:  bulletItems(lines.slice(li + 1, ri)),
    right: bulletItems(lines.slice(ri + 1)),
  };
}

function parseContentBlocks(raw) {
  const lines  = raw.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    if (!lines[i].trim()) { i++; continue; }

    // Fragment break (^^^)
    if (lines[i].trim() === '^^^') {
      blocks.push({ type: 'fragment-break' });
      i++;
      continue;
    }

    // Horizontal rule (---)
    if (lines[i].trim() === '---') {
      blocks.push({ type: 'markdown', markdown: '---\n', role: 'rule' });
      i++;
      continue;
    }

    // Fenced code block
    if (/^```/.test(lines[i].trim())) {
      const block = [lines[i++]];
      while (i < lines.length) {
        block.push(lines[i]);
        if (/^```/.test(lines[i++].trim())) break;
      }
      blocks.push({ type: 'markdown', markdown: block.join('\n') });
      continue;
    }

    // Bullet list
    if (isBullet(lines[i])) {
      const block = [];
      while (i < lines.length && (isBullet(lines[i]) || /^\s{2,}\S/.test(lines[i]) || !lines[i].trim())) {
        if (!isEmptyBullet(lines[i])) block.push(lines[i]);
        i++;
        if (!lines[i - 1].trim() && !isBullet(nextNonEmpty(lines, i))) break;
      }
      const markdown = block.join('\n').trim();
      if (markdown) blocks.push({ type: 'markdown', markdown, role: 'bullets' });
      continue;
    }

    // Paragraph — tight spacing if followed by a bullet list
    const followedByBullets = isBullet(nextNonEmpty(lines, i + 1));
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && lines[i].trim() !== '---' && !isBullet(lines[i]) && !/^```/.test(lines[i].trim())) {
      paragraph.push(lines[i++]);
    }
    blocks.push({
      type: 'markdown',
      markdown: paragraph.join('\n').trim(),
      role: followedByBullets ? 'between-bullets' : 'normal',
    });
  }

  return blocks;
}

// ── Deck parser ───────────────────────────────────────────────────────────────

function parseMarkdownDeck(markdown) {
  const lines = markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter(l => !isEmptyBullet(l));

  const ti    = lines.findIndex(l => isHeading(l, 1));
  const title = ti >= 0 ? headingText(lines[ti], 1) : 'Slides';
  let cursor  = ti + 1;

  const subtitleLines = [];
  while (cursor < lines.length && !isSectionHeading(lines[cursor]) && !isSlideHeading(lines[cursor])) {
    if (lines[cursor].trim()) subtitleLines.push(lines[cursor].trim());
    cursor++;
  }

  const slides     = [{ layout: 'title', title, subtitle: subtitleLines.join(' ') }];
  let currentSection = '';
  let currentSlide   = null;

  function finishSlide() {
    if (!currentSlide) return;
    let raw = currentSlide.lines.join('\n').trim();

    // Extract speaker notes — everything from the first "Note:" line to end of slide
    let notes = '';
    const noteIdx = raw.search(/^Note:/m);
    if (noteIdx !== -1) {
      notes = raw.slice(noteIdx).replace(/^Note:\s*/m, '').trim();
      raw   = raw.slice(0, noteIdx).trim();
    }

    const mermaid  = extractMermaid(raw);
    const graphviz = extractGraphviz(raw) || extractTree(raw);
    const columns  = parseTwoColumn(raw);
    if (mermaid || graphviz) {
      slides.push({ layout: 'diagram',     section: currentSection, title: currentSlide.title, mermaid, graphviz, notes });
    } else if (columns) {
      slides.push({ layout: 'two-column',  section: currentSection, title: currentSlide.title, ...columns, notes });
    } else {
      slides.push({ layout: 'content',     section: currentSection, title: currentSlide.title, blocks: parseContentBlocks(raw), notes });
    }
    currentSlide = null;
  }

  for (let i = cursor; i < lines.length; i++) {
    if (isSectionHeading(lines[i])) {
      finishSlide();
      currentSection = headingText(lines[i], 2);
      slides.push({ layout: 'section', section: currentSection, title: currentSection });
    } else if (isSlideHeading(lines[i])) {
      finishSlide();
      currentSlide = { title: headingText(lines[i], 3), lines: [] };
    } else if (currentSlide) {
      currentSlide.lines.push(lines[i]);
    }
  }
  finishSlide();

  return {
    metadata: { deckTitle: title, showSlideNumbers: true, showFooter: true },
    slides,
  };
}

// ── Section builders ──────────────────────────────────────────────────────────

function buildTitle(slide) {
  const sec = document.createElement('section');
  sec.className = 'title-slide';
  sec.appendChild(el('h1', 'slide-title', slide.title));
  if (slide.subtitle) {
    const sub = el('p', 'slide-subtitle');
    slide.subtitle.split('|').forEach(part => {
      const span = el('span', 'title-meta-item');
      span.innerHTML = inlineMarkdownHtml(part.trim());
      sub.appendChild(span);
    });
    sec.appendChild(sub);
  }
  return sec;
}

function buildSection(slide) {
  const sec = document.createElement('section');
  sec.className = 'section-slide';
  sec.dataset.section = slide.section || slide.title;
  sec.appendChild(el('h1', 'slide-title', slide.title || slide.section));
  return sec;
}

function buildContent(slide) {
  const sec = document.createElement('section');
  sec.className = 'content-slide';
  if (slide.section) sec.dataset.section = slide.section;
  sec.appendChild(el('h1', 'slide-title', slide.title));

  let container = sec; // blocks go here; switches to a .fragment div after ^^^

  (slide.blocks || []).forEach(block => {
    if (block.type === 'fragment-break') {
      const frag = el('div', 'fragment');
      sec.appendChild(frag);
      container = frag;
      return;
    }
    if (block.type === 'markdown') {
      container.appendChild(renderMarkdownBlock(
        block.markdown,
        block.role === 'between-bullets' ? 'markdown-block between-bullets-label' : 'markdown-block'
      ));
    }
  });
  return sec;
}

function buildTwoColumn(slide) {
  const sec = document.createElement('section');
  sec.className = 'content-slide';
  if (slide.section) sec.dataset.section = slide.section;
  sec.appendChild(el('h1', 'slide-title', slide.title));
  const grid   = el('div', 'two-column-grid');
  const makeCol = (title, items) => {
    const col = el('div', 'column');
    if (title) col.appendChild(el('h2', '', title));
    const ul = el('ul');
    (items || []).forEach(item => {
      const li = el('li');
      li.innerHTML = inlineMarkdownHtml(item);
      ul.appendChild(li);
    });
    col.appendChild(ul);
    return col;
  };
  grid.append(makeCol(slide.leftTitle, slide.left), makeCol(slide.rightTitle, slide.right));
  sec.appendChild(grid);
  return sec;
}

function buildDiagram(slide) {
  const sec = document.createElement('section');
  sec.className = 'content-slide';
  if (slide.section) sec.dataset.section = slide.section;
  sec.appendChild(el('h1', 'slide-title', slide.title));
  const frame = el('div', 'diagram-frame');
  if (slide.graphviz) {
    const source = el('script', 'graphviz', slide.graphviz);
    source.type = 'text/vnd.graphviz';
    frame.appendChild(source);
  } else {
    frame.appendChild(el('pre', 'mermaid', slide.mermaid || ''));
  }
  sec.appendChild(frame);
  return sec;
}

const builders = {
  title:        buildTitle,
  section:      buildSection,
  content:      buildContent,
  'two-column': buildTwoColumn,
  diagram:      buildDiagram,
};

// ── Footer ────────────────────────────────────────────────────────────────────

function getSections(slides) {
  const seen = new Set();
  return slides.reduce((acc, slide, index) => {
    const name = slide.section || (slide.layout === 'section' ? slide.title : '');
    if (name && !seen.has(name)) { seen.add(name); acc.push({ name, index }); }
    return acc;
  }, []);
}

function addFooter(sectionEl, slide, index, total, sections, assetBase) {
  const footer = el('footer', 'slide-footer');

  if (sections.length) {
    const nav = el('nav', 'section-nav');
    nav.setAttribute('aria-label', 'Sections');
    sections.forEach(sec => {
      const btn = el('button', 'section-nav-item', sec.name);
      btn.type = 'button';
      btn.dataset.sectionTarget = sec.name;
      if (sec.name === (slide.section || slide.title)) btn.classList.add('is-active');
      btn.addEventListener('click', e => { e.stopPropagation(); Reveal.slide(sec.index); });
      nav.appendChild(btn);
    });
    footer.appendChild(nav);
  }

  const left = el('span', 'footer-left');
  const logo = document.createElement('img');
  logo.className = 'footer-logo';
  logo.src = `${assetBase}rsm_logo.png`;
  logo.alt = 'RSM';
  left.appendChild(logo);
  footer.appendChild(left);
  footer.appendChild(el('span', 'footer-slide-number', `${index + 1} / ${total}`));

  sectionEl.appendChild(footer);
}

// ── Deck renderer ─────────────────────────────────────────────────────────────

async function renderDeck(deck) {
  const slidesEl  = document.querySelector('.slides');
  const metadata  = deck.metadata || {};
  const slideList = deck.slides   || [];
  const assetBase = slidesEl.dataset.assetBase || '../../engine/assets/images/';
  const sections  = getSections(slideList);
  const total     = slideList.length;

  slidesEl.replaceChildren();

  slideList.forEach((slide, index) => {
    const sec = (builders[slide.layout] || builders.content)(slide);
    sec.dataset.layout = slide.layout || 'content';
    if (slide.notes) {
      const aside = document.createElement('aside');
      aside.className = 'notes';
      aside.innerHTML = markdownHtml(slide.notes);
      sec.appendChild(aside);
    }
    if (slide.layout !== 'title' && metadata.showFooter !== false) {
      addFooter(sec, slide, index, total, sections, assetBase);
    }
    slidesEl.appendChild(sec);
  });

  await renderMath(slidesEl);

  await Reveal.initialize({
    width:  1280,
    height: 720,
    margin: 0,
    minScale: 0.2,
    maxScale: 2.0,
    controls:            false,
    progress:            false,
    slideNumber:         false,
    hash:                true,
    center:              false,
    transition:          'none',
    backgroundTransition:'none',
    pdfSeparateFragments: false,
    plugins: [RevealNotes],
  });

  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        fontFamily:          'Garamond, Georgia, serif',
        fontSize:            '30px',
        primaryColor:        '#fffefa',
        primaryTextColor:    '#151515',
        primaryBorderColor:  '#2457a6',
        lineColor:           '#2457a6',
        edgeLabelBackground: '#fffefa',
        labelBackground:     '#fffefa',
        secondaryColor:      '#f7f4ec',
        tertiaryColor:       '#ffffff',
        nodeBorder:          '#2457a6',
        clusterBkg:          '#fffefa',
        clusterBorder:       '#ded9ce',
      },
      flowchart: { curve: 'basis', diagramPadding: 34, nodeSpacing: 95, rankSpacing: 90, htmlLabels: true },
      sequence:  { diagramMarginX: 48, diagramMarginY: 24, boxMargin: 12, noteMargin: 16,
                   messageMargin: 44, mirrorActors: false, actorMargin: 72 },
    });
    await window.mermaid.run({ nodes: document.querySelectorAll('.mermaid') });
  }

  if (window.Viz) {
    const viz = window.Viz.instance ? await window.Viz.instance() : new window.Viz();
    document.querySelectorAll('.graphviz').forEach(node => {
      try {
        const rendered = viz.renderSVGElement(node.textContent);
        Promise.resolve(rendered).then(svg => {
          svg.removeAttribute('width');
          svg.removeAttribute('height');
          node.replaceWith(svg);
        }).catch(error => {
          const pre = el('pre', 'diagram-error', error.message || String(error));
          node.replaceWith(pre);
        });
      } catch (error) {
        const pre = el('pre', 'diagram-error', error.message || String(error));
        node.replaceWith(pre);
      }
    });
  }

  // Keep section nav in sync as slides change
  function updateNav() {
    const current = Reveal.getCurrentSlide()?.dataset.section || '';
    document.querySelectorAll('.section-nav-item').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.sectionTarget === current);
    });
  }

  // Fit text on the current slide; re-run whenever the slide changes
  function fitCurrent() { fitSlideText(Reveal.getCurrentSlide()); }

  Reveal.on('ready',        () => { updateNav(); fitCurrent(); });
  Reveal.on('slidechanged', () => { updateNav(); fitCurrent(); });
  Reveal.on('resize',       fitCurrent);
}

// ── Content auto-scaling ─────────────────────────────────────────────────────
// Reduces --fit-scale on a slide until its content fits above the footer.
// All font-size values in theme.css use calc(Npx * var(--fit-scale)).

function contentBottom(section) {
  const footer = section.querySelector('.slide-footer');
  const nodes  = [...section.children].filter(c => c !== footer);
  const top    = section.getBoundingClientRect().top;
  return nodes.reduce((max, node) => Math.max(max, node.getBoundingClientRect().bottom), top);
}

function fitSlideText(section) {
  if (!section || section.dataset.layout === 'diagram') return;

  const footer    = section.querySelector('.slide-footer');
  const sectionRect = section.getBoundingClientRect();
  const limit     = footer
    ? footer.getBoundingClientRect().top - 12
    : sectionRect.bottom - 80; // approximate padding-bottom

  let scale = 1;
  section.style.setProperty('--fit-scale', scale);

  while (contentBottom(section) > limit && scale > 0.72) {
    scale = Math.max(0.72, scale - 0.02);
    section.style.setProperty('--fit-scale', scale.toFixed(2));
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────

loadMarkdown()
  .then(parseMarkdownDeck)
  .then(renderDeck)
  .catch(err => {
    const slides = document.querySelector('.slides');
    if (slides) slides.innerHTML = `<section><p style="color:red;font-family:sans-serif">${err.message}</p></section>`;
  });
