import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let srv;
before(async () => { srv = await startTestServer(); });
after(async () => { await srv.close(); });

test('GET /api/data/collections/:id/records lista los registros de la colección', async () => {
  const col = await srv.request('POST', '/api/data/collections', { name: 'productos' });
  const id = col.json.data.id;
  await srv.request('POST', `/api/data/collections/${id}/records`, { data: { sku: 'A1' } });
  const { status, json } = await srv.request('GET', `/api/data/collections/${id}/records`);
  assert.equal(status, 200);
  assert.equal(json.data.length, 1);
});
