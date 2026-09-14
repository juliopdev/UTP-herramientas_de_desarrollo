import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';
import * as schema from './schema.js';

// Asegurar que exista la carpeta data/
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializar conexión better-sqlite3
const sqlite = new Database(config.dbPath);
sqlite.pragma('journal_mode = WAL');

// Crear tablas automáticamente si no existen
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subdomain TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active',
    plan TEXT DEFAULT 'starter',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    schema_json TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    collection_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    data_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'viewer',
    status TEXT DEFAULT 'active',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    title TEXT NOT NULL,
    storage_mb REAL DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    status TEXT DEFAULT 'generated',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS system_metrics (
    id TEXT PRIMARY KEY,
    metric_key TEXT NOT NULL UNIQUE,
    metric_value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

// Instancia Drizzle ORM
export const db = drizzle(sqlite, { schema });

// Función para sembrar datos desde initialData.json si la base de datos está vacía
export function seedDatabaseIfEmpty() {
  const count = sqlite.prepare('SELECT count(*) as total FROM tenants').get().total;
  if (count === 0) {
    const seedPath = path.resolve('data', 'initialData.json');
    if (fs.existsSync(seedPath)) {
      try {
        const raw = fs.readFileSync(seedPath, 'utf8');
        const seed = JSON.parse(raw);

        const insertTenant = sqlite.prepare(`
          INSERT INTO tenants (id, name, subdomain, status, plan, created_at)
          VALUES (@id, @name, @subdomain, @status, @plan, @createdAt)
        `);
        const insertUser = sqlite.prepare(`
          INSERT INTO users (id, tenant_id, name, email, role, status, created_at)
          VALUES (@id, @tenantId, @name, @email, @role, @status, @createdAt)
        `);
        const insertReport = sqlite.prepare(`
          INSERT INTO reports (id, tenant_id, title, storage_mb, api_calls, status, created_at)
          VALUES (@id, @tenantId, @title, @storageMb, @apiCalls, @status, @createdAt)
        `);

        if (seed.tenants) {
          for (const t of seed.tenants) insertTenant.run(t);
        }
        if (seed.users) {
          for (const u of seed.users) insertUser.run({ ...u, createdAt: new Date().toISOString() });
        }
        if (seed.reports) {
          for (const r of seed.reports) insertReport.run({ ...r, createdAt: new Date().toISOString() });
        }
        console.log('✅ Base de datos inicializada y sembrada con éxito desde data/initialData.json');
      } catch (err) {
        console.error('⚠️ Error al cargar initialData.json:', err.message);
      }
    }
  }
}
