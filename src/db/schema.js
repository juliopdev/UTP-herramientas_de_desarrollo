import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

/**
 * Tabla de Organizaciones / Tenants (Módulo Integrante 1)
 */
export const tenants = sqliteTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull().unique(),
  status: text('status').default('active'),
  plan: text('plan').default('starter'),
  createdAt: text('created_at').notNull()
});

/**
 * Tabla de Colecciones Dinámicas (Módulo Integrante 2)
 */
export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  schemaJson: text('schema_json'),
  createdAt: text('created_at').notNull()
});

/**
 * Tabla de Registros No-Code (Módulo Integrante 2)
 */
export const records = sqliteTable('records', {
  id: text('id').primaryKey(),
  collectionId: text('collection_id').notNull(),
  tenantId: text('tenant_id').notNull(),
  dataJson: text('data_json').notNull(),
  createdAt: text('created_at').notNull()
});

/**
 * Tabla de Usuarios y Roles (Módulo Integrante 3)
 */
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').default('viewer'),
  status: text('status').default('active'),
  createdAt: text('created_at').notNull()
});

/**
 * Tabla de Reportes y Consumo (Módulo Integrante 4)
 */
export const reports = sqliteTable('reports', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  title: text('title').notNull(),
  storageMb: real('storage_mb').default(0),
  apiCalls: integer('api_calls').default(0),
  status: text('status').default('generated'),
  createdAt: text('created_at').notNull()
});

/**
 * Tabla de Métricas del Sistema (Módulo Owner)
 */
export const systemMetrics = sqliteTable('system_metrics', {
  id: text('id').primaryKey(),
  metricKey: text('metric_key').notNull().unique(),
  metricValue: text('metric_value').notNull(),
  updatedAt: text('updated_at').notNull()
});
