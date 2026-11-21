import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let srv;
before(async () => { srv = await startTestServer(); });
after(async () => { await srv.close(); });

test('POST /api/reports/generate sin métricas responde 400 en vez de inventar datos', async () => {
  const { status, json } = await srv.request('POST', '/api/reports/generate', { tenantId: 'tenant-001' });
  assert.equal(status, 400);
  assert.equal(json.success, false);
});

test('POST /api/reports/generate guarda las métricas enviadas', async () => {
  const { status, json } = await srv.request('POST', '/api/reports/generate', { tenantId: 'tenant-001', storageMb: 12.5, apiCalls: 300 });
  assert.equal(status, 201);
  assert.equal(json.data.storageMb, 12.5);
  assert.equal(json.data.apiCalls, 300);
});

test('el panel muestra el formulario de reportes', async () => {
  const { text } = await srv.request('GET', '/');
  assert.match(text, /data-api="\/api\/reports\/generate"/);
});
