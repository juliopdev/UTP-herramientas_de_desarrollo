import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer } from './helpers.js';

let srv;
before(async () => { srv = await startTestServer(); });
after(async () => { await srv.close(); });

test('GET / muestra la sección de formularios de los 4 módulos', async () => {
  const { text } = await srv.request('GET', '/');
  for (const titulo of ['Registrar tenant', 'Registrar usuario', 'Crear colección', 'Generar reporte']) {
    assert.match(text, new RegExp(titulo));
  }
});
