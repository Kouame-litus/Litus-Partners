const fs   = require('fs');
const path = require('path');

const TEMPLATE = path.join(__dirname, 'contact', 'index.html');
const SERVICES = ['conseil','soutien','gouvernance','ia','innovation','technologies','diagnostic'];

const template = fs.readFileSync(TEMPLATE, 'utf8');

for (const service of SERVICES) {
  const dir = path.join(__dirname, 'contact', service);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const html = template.replace(
    '<script>',
    `<script>window.CONTACT_SERVICE='${service}';</script>\n<script>`
  );
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

console.log(`✅ ${SERVICES.length} page(s) contact générée(s)`);
