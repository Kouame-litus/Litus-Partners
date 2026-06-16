// build-postes.js — génère postes.json depuis les fichiers markdown du CMS
// Exécuté automatiquement par Netlify lors du déploiement

const fs   = require('fs');
const path = require('path');

const DIR  = path.join(__dirname, 'postes');
const OUT  = path.join(__dirname, 'postes.json');

if (!fs.existsSync(DIR)) { fs.writeFileSync(OUT, '[]'); process.exit(0); }

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md'));
const postes = [];

files.forEach(file => {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const fm  = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return;
  const meta = {};
  fm[1].split('\n').forEach(line => {
    const [k, ...v] = line.split(':');
    if (k) meta[k.trim()] = v.join(':').trim().replace(/^["']|["']$/g, '');
  });
  postes.push({
    titre:        meta.titre        || '',
    lieu:         meta.lieu         || 'Québec, Canada',
    type_contrat: meta.type_contrat || 'Temps plein',
    mode:         meta.mode         || 'Hybride',
    date:         meta.date         || '',
    actif:        meta.actif !== 'false',
    slug:         file.replace('.md','')
  });
});

postes.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(OUT, JSON.stringify(postes, null, 2));
console.log('postes.json généré —', postes.length, 'poste(s)');
