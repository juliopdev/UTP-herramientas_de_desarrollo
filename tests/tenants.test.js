import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let srv;
before(async () => { srv = await startTestServer(); });
after(async () => { await srv.close(); });

test('POST /api/tenants rechaza un subdominio con espacios o mayúsculas', async () => {
  const { status, json } = await srv.request('POST', '/api/tenants', { name: 'Mi Empresa', subdomain: 'Mi Empresa!' });
  assert.equal(status, 400);
  assert.equal(json.success, false);
});

test('POST /api/tenants acepta un subdominio válido', async () => {
  const { status } = await srv.request('POST', '/api/tenants', { name: 'Initech', subdomain: 'initech-pe' });
  assert.equal(status, 201);
});
