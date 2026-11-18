import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'app.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  team TEXT,
  role TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  city TEXT,
  country TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS service_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  sequence INTEGER NOT NULL DEFAULT 0,
  archived_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES service_categories(id),
  service_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  base_price REAL NOT NULL DEFAULT 0,
  base_cost REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  delivery_days INTEGER NOT NULL DEFAULT 5,
  team TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  archived_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  display_type TEXT NOT NULL,
  variant_creation TEXT NOT NULL,
  allow_custom_value INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  sequence INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS attribute_values (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attribute_id INTEGER NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  price_extra REAL NOT NULL DEFAULT 0,
  color TEXT,
  is_custom INTEGER NOT NULL DEFAULT 0,
  sequence INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  archived_at TEXT,
  UNIQUE(attribute_id, code)
);

CREATE TABLE IF NOT EXISTS service_attributes (
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  attribute_id INTEGER NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  required INTEGER NOT NULL DEFAULT 0,
  variant_creating INTEGER NOT NULL DEFAULT 0,
  sequence INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (service_id, attribute_id)
);

CREATE TABLE IF NOT EXISTS service_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL DEFAULT 0,
  cost REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  delivery_days INTEGER NOT NULL DEFAULT 5,
  available INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  archived_at TEXT,
  generation TEXT NOT NULL DEFAULT 'instantly',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS variant_values (
  variant_id INTEGER NOT NULL REFERENCES service_variants(id) ON DELETE CASCADE,
  attribute_id INTEGER NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  attribute_value_id INTEGER NOT NULL REFERENCES attribute_values(id) ON DELETE CASCADE,
  PRIMARY KEY (variant_id, attribute_id)
);

CREATE TABLE IF NOT EXISTS variant_exclusions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  variant_id INTEGER NOT NULL REFERENCES service_variants(id) ON DELETE CASCADE,
  attribute_id INTEGER NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  attribute_value_id INTEGER NOT NULL REFERENCES attribute_values(id) ON DELETE CASCADE,
  blocked_attribute_id INTEGER NOT NULL,
  blocked_value_id INTEGER NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(variant_id, attribute_id, attribute_value_id, blocked_attribute_id, blocked_value_id)
);

CREATE TABLE IF NOT EXISTS configuration_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  field_type TEXT NOT NULL,
  options TEXT NOT NULL DEFAULT '[]',
  is_required INTEGER NOT NULL DEFAULT 0,
  price_extra REAL NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS support_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  support_email TEXT,
  support_phone TEXT,
  support_hours TEXT,
  sla_response_time TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS service_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  business_id INTEGER NOT NULL REFERENCES businesses(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  variant_id INTEGER REFERENCES service_variants(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  priority TEXT NOT NULL DEFAULT 'normal',
  assigned_to INTEGER REFERENCES people(id),
  assigned_team TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  requested_date TEXT,
  required_date TEXT,
  scheduled_date TEXT,
  completed_at TEXT,
  selected_variants TEXT NOT NULL DEFAULT '[]',
  configuration TEXT NOT NULL DEFAULT '{}',
  add_ons TEXT NOT NULL DEFAULT '[]',
  base_price REAL NOT NULL DEFAULT 0,
  variant_price REAL NOT NULL DEFAULT 0,
  attribute_extras REAL NOT NULL DEFAULT 0,
  configuration_charges REAL NOT NULL DEFAULT 0,
  discount_type TEXT,
  discount_value REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS request_line_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  service_id INTEGER NOT NULL REFERENCES services(id),
  variant_id INTEGER REFERENCES service_variants(id),
  description TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL DEFAULT 0,
  line_total REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS request_configuration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  attribute_id INTEGER NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  attribute_value_id INTEGER REFERENCES attribute_values(id),
  custom_value TEXT,
  price_extra REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS request_addons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL DEFAULT 0,
  quantity REAL NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS request_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS helpdesk_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  business_id INTEGER NOT NULL REFERENCES businesses(id),
  service_id INTEGER REFERENCES services(id),
  service_request_id INTEGER REFERENCES service_requests(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to INTEGER REFERENCES people(id),
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  sla_due_at TEXT,
  resolved_at TEXT,
  closed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_role TEXT NOT NULL,
  body TEXT NOT NULL,
  is_internal INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);
`);

// ---- Parity migrations (idempotent) ----
function tryAlter(sql: string) { try { db.exec(sql); } catch (e) { /* column/table already exists */ } }

// businesses
tryAlter(`ALTER TABLE businesses ADD COLUMN code TEXT`);
tryAlter(`ALTER TABLE businesses ADD COLUMN relationship TEXT NOT NULL DEFAULT 'client'`);
tryAlter(`ALTER TABLE businesses ADD COLUMN parent_business_id INTEGER REFERENCES businesses(id)`);
tryAlter(`ALTER TABLE businesses ADD COLUMN is_customer INTEGER NOT NULL DEFAULT 0`);
tryAlter(`ALTER TABLE businesses ADD COLUMN is_portfolio INTEGER NOT NULL DEFAULT 0`);
tryAlter(`ALTER TABLE businesses ADD COLUMN relationships TEXT NOT NULL DEFAULT '[]'`);
tryAlter(`ALTER TABLE businesses ADD COLUMN industry TEXT`);
tryAlter(`ALTER TABLE businesses ADD COLUMN contact_role TEXT`);
tryAlter(`ALTER TABLE businesses ADD COLUMN social_linkedin TEXT`);
tryAlter(`ALTER TABLE businesses ADD COLUMN social_twitter TEXT`);
tryAlter(`ALTER TABLE businesses ADD COLUMN social_facebook TEXT`);
tryAlter(`ALTER TABLE businesses ADD COLUMN social_instagram TEXT`);
tryAlter(`ALTER TABLE businesses ADD COLUMN social_website TEXT`);
tryAlter(`ALTER TABLE businesses ADD COLUMN tier TEXT`);
tryAlter(`ALTER TABLE businesses ADD COLUMN health_score INTEGER`);

// people
tryAlter(`ALTER TABLE people ADD COLUMN discipline TEXT`);
tryAlter(`ALTER TABLE people ADD COLUMN hourly_rate REAL NOT NULL DEFAULT 0`);
tryAlter(`ALTER TABLE people ADD COLUMN weekly_hours REAL NOT NULL DEFAULT 40`);
tryAlter(`ALTER TABLE people ADD COLUMN classification TEXT NOT NULL DEFAULT 'internal'`);
tryAlter(`ALTER TABLE people ADD COLUMN employment_type TEXT NOT NULL DEFAULT 'full_time'`);
tryAlter(`ALTER TABLE people ADD COLUMN compensation_model TEXT NOT NULL DEFAULT 'hourly'`);
tryAlter(`ALTER TABLE people ADD COLUMN resource_status TEXT NOT NULL DEFAULT 'active'`);
tryAlter(`ALTER TABLE people ADD COLUMN tax_or_vendor_id TEXT`);
tryAlter(`ALTER TABLE people ADD COLUMN overtime_multiplier REAL NOT NULL DEFAULT 1.5`);
tryAlter(`ALTER TABLE people ADD COLUMN max_billable_hours REAL`);
tryAlter(`ALTER TABLE people ADD COLUMN monthly_salary REAL`);
tryAlter(`ALTER TABLE people ADD COLUMN payroll_schedule TEXT`);
tryAlter(`ALTER TABLE people ADD COLUMN allowance_limit REAL`);
tryAlter(`ALTER TABLE people ADD COLUMN invoice_requirement TEXT`);
tryAlter(`ALTER TABLE people ADD COLUMN tax_document_kind TEXT`);
tryAlter(`ALTER TABLE people ADD COLUMN tax_document_status TEXT NOT NULL DEFAULT 'missing'`);
tryAlter(`ALTER TABLE people ADD COLUMN tax_document_expires TEXT`);
tryAlter(`ALTER TABLE people ADD COLUMN payable_schedule TEXT`);
tryAlter(`ALTER TABLE people ADD COLUMN bank_account_ref TEXT`);

// services
tryAlter(`ALTER TABLE services ADD COLUMN archived_reason TEXT`);

// service_requests
tryAlter(`ALTER TABLE service_requests ADD COLUMN requested_by TEXT NOT NULL DEFAULT 'Zainpreneur'`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN contact_role TEXT`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN special_requirements TEXT`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN variant_extra REAL NOT NULL DEFAULT 0`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN additional_services REAL NOT NULL DEFAULT 0`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN discount_amount REAL NOT NULL DEFAULT 0`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN final_amount REAL NOT NULL DEFAULT 0`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN snapshot TEXT NOT NULL DEFAULT '{}'`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN resources TEXT NOT NULL DEFAULT '[]'`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN deployment TEXT`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN delivery_summary TEXT`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN delivered_at TEXT`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN fulfilled_at TEXT`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN closed_at TEXT`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN branch_id INTEGER`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN scope_mode TEXT NOT NULL DEFAULT 'single'`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN parent_request_id INTEGER REFERENCES service_requests(id)`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN preferred_window TEXT`);
tryAlter(`ALTER TABLE service_requests ADD COLUMN retention_account_id INTEGER`);

// helpdesk_tickets
tryAlter(`ALTER TABLE helpdesk_tickets ADD COLUMN subject TEXT`);
tryAlter(`ALTER TABLE helpdesk_tickets ADD COLUMN contact_role TEXT`);
tryAlter(`ALTER TABLE helpdesk_tickets ADD COLUMN variant_id INTEGER REFERENCES service_variants(id)`);
tryAlter(`ALTER TABLE helpdesk_tickets ADD COLUMN resolution TEXT`);
tryAlter(`ALTER TABLE helpdesk_tickets ADD COLUMN resolution_summary TEXT`);
tryAlter(`ALTER TABLE helpdesk_tickets ADD COLUMN assigned_team TEXT`);

// business_contacts
db.exec(`
CREATE TABLE IF NOT EXISTS business_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL
);
`);

// business_branches
db.exec(`
CREATE TABLE IF NOT EXISTS business_branches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  created_at TEXT NOT NULL
);
`);

// retention_accounts
db.exec(`
CREATE TABLE IF NOT EXISTS retention_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  account_ref TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  primary_account INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  UNIQUE (business_id, name)
);
`);

// ticket_relations
db.exec(`
CREATE TABLE IF NOT EXISTS ticket_relations (
  ticket_id INTEGER NOT NULL REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
  related_id INTEGER NOT NULL REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
  PRIMARY KEY (ticket_id, related_id)
);
`);

// tags
db.exec(`
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  archived_at TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS service_tags (
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id, tag_id)
);
CREATE TABLE IF NOT EXISTS request_tags (
  request_id INTEGER NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (request_id, tag_id)
);
CREATE TABLE IF NOT EXISTS ticket_tags (
  ticket_id INTEGER NOT NULL REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (ticket_id, tag_id)
);
CREATE TABLE IF NOT EXISTS business_tags (
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, tag_id)
);
CREATE TABLE IF NOT EXISTS person_tags (
  person_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (person_id, tag_id)
);
`);

export default db;
export { db };
