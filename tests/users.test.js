import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let srv;
before(async () => { srv = await startTestServer(); });
after(async () => { await srv.close(); });

test('PATCH /api/users/:id/role responde 404 si el usuario no existe', async () => {
    const { status, json } = await srv.request('PATCH', '/api/users/usr-no-existe/role', { role: 'admin' });
    assert.equal(status, 404);
    assert.equal(json.success, false);
});

test('PATCH /api/users/:id/role actualiza un usuario existente', async () => {
    const { status } = await srv.request('PATCH', '/api/users/usr-001/role', { role: 'editor' });
    assert.equal(status, 200);
});

test('el panel muestra el formulario de registro de usuarios', async () => {
    const { text } = await srv.request('GET', '/');
    assert.match(text, /data-api="\/api\/users"/);
});