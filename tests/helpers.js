import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { once } from 'node:events';

// Levanta la app en un puerto libre con una base SQLite temporal propia de este archivo de pruebas.
export async function startTestServer() {
  const dbFile = path.join(os.tmpdir(), `baas-test-${process.pid}-${Date.now()}.db`);
  process.env.DB_PATH = dbFile; // config.js lee DB_PATH al importarse: va antes del import
  const { app } = await import('../src/app.js');
  const server = app.listen(0);
  await once(server, 'listening');
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const close = async () => {
    server.close();
    for (const f of [dbFile, `${dbFile}-wal`, `${dbFile}-shm`]) {
      try { fs.rmSync(f, { force: true }); } catch { /* en Windows sigue abierto: se ignora */ }
    }
  };

  // Atajo para pedir JSON a la API
  const request = async (method, url, body) => {
    const res = await fetch(baseUrl + url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* respuesta HTML */ }
    return { status: res.status, json, text };
  };

  return { baseUrl, close, request };
}
