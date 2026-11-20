// "Build" de BaaS Lite: el proyecto no transpila, así que el build verifica que todo lo que se despliega sea válido.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ejs from 'ejs';

let errors = 0;
const fail = (msg) => { console.error(`✖ ${msg}`); errors++; };

function walk(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, ext) : p.endsWith(ext) ? [p] : [];
  });
}

// 1. Sintaxis de todo el JavaScript del servidor y de la función de Netlify
const jsFiles = [...walk('src', '.js'), ...walk('netlify', '.js'), ...walk('scripts', '.js')];
for (const file of jsFiles) {
  const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (r.status !== 0) fail(`Sintaxis inválida en ${file}\n${r.stderr}`);
}
console.log(`✔ ${jsFiles.length} archivos JS revisados`);

// 2. Plantillas EJS compilables
const views = walk('views', '.ejs');
for (const file of views) {
  try { ejs.compile(fs.readFileSync(file, 'utf8'), { filename: file }); }
  catch (e) { fail(`Plantilla EJS inválida en ${file}: ${e.message}`); }
}
console.log(`✔ ${views.length} plantillas EJS compiladas`);

// 3. Semillero JSON válido y con las colecciones mínimas
try {
  const seed = JSON.parse(fs.readFileSync('data/initialData.json', 'utf8'));
  for (const key of ['tenants', 'users', 'reports']) {
    if (!Array.isArray(seed[key])) fail(`data/initialData.json no tiene el arreglo "${key}"`);
  }
  console.log('✔ data/initialData.json válido');
} catch (e) { fail(`data/initialData.json no es JSON válido: ${e.message}`); }

if (errors) { console.error(`\nBuild fallido: ${errors} error(es)`); process.exit(1); }
console.log('\nBuild correcto');
