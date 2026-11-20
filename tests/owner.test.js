import fs from 'node:fs';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let srv;
before(async () => { srv = await startTestServer(); });
after(async () => { await srv.close(); });

test('GET /api/health responde 200 con status ok y métricas', async () => {
  const { status, json } = await srv.request('GET', '/api/health');
  assert.equal(status, 200);
  assert.equal(json.status, 'ok');
  assert.equal(json.database, 'connected');
  assert.ok(json.metrics.totalTenants >= 1, 'la BD de prueba debe venir sembrada');
});

test('GET / renderiza el dashboard superadmin', async () => {
  const { status, text } = await srv.request('GET', '/');
  assert.equal(status, 200);
  assert.match(text, /Superadmin/);
});

test('GET /api/health informa la misma versión que package.json', async () => {
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const { json } = await srv.request('GET', '/api/health');
  assert.equal(json.version, pkg.version);
});
