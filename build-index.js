// Script de génération automatique de l'index des articles Réflexions
// Exécuté par Vercel à chaque déploiement
const fs   = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, 'reflexions', 'articles');
const OUTPUT_FILE  = path.join(__dirname, 'reflexions', 'articles.json');
const TEMPLATE     = path.join(__dirname, 'reflexions', 'article.html');

// Créer le dossier si inexistant
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}

// Lire tous les fichiers .md
const files = fs.existsSync(ARTICLES_DIR)
  ? fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'))
  : [];

const articles = [];

for (const file of files) {
  const raw  = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
  const meta = parseFrontmatter(raw);
  if (!meta.title) continue;

  const slug      = file.replace(/\.md$/, '');
  const cleanSlug = toCleanSlug(slug);

  articles.push({
    slug,
    cleanSlug,
    title:    meta.title    || '',
    category: meta.category || '',
    date:     meta.date     || '',
    image:    meta.image    || '',
    summary:  meta.summary  || '',
    readtime: meta.readtime || 5,
    author:   meta.author   || 'Litus Partners',
    body:     meta._body    || ''
  });
}

// Trier par date décroissante
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2), 'utf8');
console.log(`✅ ${articles.length} article(s) indexé(s) → reflexions/articles.json`);

// Générer un fichier HTML par article avec URL propre
const template = fs.existsSync(TEMPLATE) ? fs.readFileSync(TEMPLATE, 'utf8') : null;
if (template) {
  for (const art of articles) {
    const dir = path.join(__dirname, 'reflexions', art.cleanSlug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const html = template.replace(
      '<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>',
      `<script>window.ARTICLE_SLUG='${art.slug}';</script>\n<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>`
    );
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  }
  console.log(`✅ ${articles.length} page(s) article générée(s)`);
}

// ─── Slug propre sans date ni accents ────────────────────────────────────────
function toCleanSlug(filename) {
  let s = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  s = s.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return s;
}

// ─── Parseur de frontmatter YAML minimal ─────────────────────────────────────
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { _body: raw };
  const yaml = m[1];
  const body = m[2].trim();
  const result = { _body: body };
  for (const line of yaml.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let val   = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
    result[key] = val;
  }
  return result;
}
