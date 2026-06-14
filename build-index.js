// Script de génération automatique de l'index des articles Réflexions
// Exécuté par Netlify à chaque déploiement
const fs   = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, 'reflexions', 'articles');
const OUTPUT_FILE  = path.join(__dirname, 'reflexions', 'articles.json');

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

  articles.push({
    slug:     file.replace(/\.md$/, ''),
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
