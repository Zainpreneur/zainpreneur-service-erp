# Migration Parity Plan — zainpreneur-service-erp vs zainpreneur-v2

Goal: bring the Next.js `zainpreneur-service-erp` (target) to full feature parity with the
Service Request module of `zainpreneur-v2` (source), while improving UI/UX and architecture
(glassmorphism, App Router, server repositories, TypeScript).

Scope of this plan: the Service Request module only —
Businesses, People, Services (+ categories/variants/attributes/configuration/support info),
Service Requests, Help Desk Tickets. Other v2 modules (finance, expenses, leads, etc.) are
out of scope.

Status legend: ✅ done · 🟡 partial · ❌ missing

---

## Phase 0 — Foundation (done)
## Phase 1–4 — Data layer (schema + repositories + types + APIs) ✅ DONE

Implemented in this session:
- All parity columns added via idempotent `ALTER TABLE` migrations in `src/lib/db.ts`
  (businesses, people, service_requests, helpdesk_tickets + business_contacts table).
- `businesses.ts`, `people.ts`, `requests.ts`, `tickets.ts` repositories hydrate and persist the new fields.
- `types.ts` interfaces and input types extended for all new fields.
- Lint clean.

## Phase 5 — Reusable UI + module UI parity ✅ DONE (this session)

Built an advanced, glassmorphism-based reusable UI library applied consistently across all modules:

**New components (src/components/ui/):**
- `Form.tsx` — Field, TextInput, TextArea, Select, Checkbox, RadioCards, FormSection, FormFooter (label/hint/error/char-count)
- `Table.tsx` — DataTable with client-side sorting, glass header/rows
- `ListView.tsx` — ListItem + ListView (glass cards, leading/trailing/badge)
- `CardGridView.tsx` — CardGridView + StatTile (glass stat cards with trend)
- `PageHeader.tsx` — consistent page title/description/action/back
- `Badge.tsx` — 12 theme-aware colors
- `Modal.tsx` — bottom-sheet on mobile, centred card on desktop, glass surface
- `EmptyState.tsx` — improved

**Applied to pages:**
- `page.tsx` (dashboard) — StatTile cards + PageHeader
- `businesses/page.tsx` — ListView + contacts/branches modals with Form components
- `people/page.tsx` — ListView + workforce Form
- `services/page.tsx` — CardGridView/ListView/DataTable/gallery + ViewSwitcher
- `requests/page.tsx` — DataTable/ListView/CardGridView/board + PageHeader
- `tickets/page.tsx` — DataTable/ListView/CardGridView/board + PageHeader
- `attributes/page.tsx` — ListView + attribute/value modals with Form
- `requests/new/page.tsx` — full pricing/contact/description form with Form sections
- `tickets/new/page.tsx` — ticket details/contact/SLA form with Form sections

## Phase 6 — Comprehensive CRUD ✅ DONE

All entities have full CRUD (GET list, GET by id, POST create, PUT update, DELETE delete) with zod validation:

**API Routes (all with validation):**
- `/api/categories` + `[id]` — service categories
- `/api/services` + `[id]` — services
- `/api/attributes` + `[id]` — attributes
- `/api/attribute-values` + `[id]` — attribute values
- `/api/config-rules` + `[id]` — configuration rules
- `/api/variants` + `[id]` — service variants
- `/api/service-attributes` — service-attribute linking
- `/api/support-info` + `[id]` — support info (upsert)
- `/api/businesses` + `[id]` — businesses
- `/api/people` + `[id]` — people
- `/api/business-contacts` + `[id]` — business contacts
- `/api/business-branches` + `[id]` — business branches
- `/api/retention-accounts` + `[id]` — retention accounts
- `/api/tags` + `[id]` — tags
- `/api/entity-tags` — entity-tag linking
- `/api/requests` + `[id]` — service requests
- `/api/tickets` + `[id]` — help desk tickets
- `/api/ticket-relations` — ticket relations

**Server repositories** (`src/lib/server/`): all entities have list/get/create/update/delete functions with proper hydration.

**Validation** (`src/lib/validation.ts`): zod schemas for all input types.

## Phase 7 — Full CRUD UI ✅ DONE

All 12 entities have full CRUD UI (list, create, edit, delete) built on the reusable component library:

**Pages with comprehensive CRUD:**
- `/categories` — create, edit, delete per item (list view)
- `/services` — create, edit, delete per item (card/list/table/gallery views)
- `/attributes` — create, edit, delete per item (list view) + attribute values CRUD
- `/variants` — create, edit, delete per item (list view)
- `/config-rules` — create, edit, delete per item (list view)
- `/businesses` — create, edit, delete per item (list view) + contacts + branches sub-CRUD
- `/people` — create, edit, delete per item (list view)
- `/retention-accounts` — create, edit, delete per item (list view, per-business scoped)
- `/business-branches` — create, edit, delete per item (list view, per-business scoped)
- `/tags` — create, edit, delete per item (list view)
- `/requests` — create, edit, delete per item (table/list/card/board views)
- `/tickets` — create, edit, delete per item (table/list/card/board views) + relations + tags

**Every list item across all views has:**
- Edit button (opens modal pre-filled with existing data)
- Delete button (with confirmation dialog)
- View/navigate to detail page

**All pages use:** PageHeader, glassmorphism cards, ListView/DataTable/CardGridView, Modal with Form sections, zod-validated APIs.

Remaining: test suite, production build env fix.

- ✅ Next.js 16 App Router + TS + Tailwind 4 + better-sqlite3
- ✅ Domain repositories in `src/lib/server/*` with hydration
- ✅ Core CRUD APIs for businesses, people, services, attributes, variants, requests, tickets
- ✅ UI component library (Card, StatCard, Modal, Tabs, ViewSwitcher, Badge, …)
- ✅ Glassmorphism card/panel primitives applied across UI
- ✅ Lint clean (`npm run lint` exit 0)

## Phase 1 — Schema parity (businesses, people)

### businesses
| Field (v2) | service-erp | Status |
|---|---|---|
| name, code (UNIQUE) | reference, name | 🟡 rename/align: v2 uses `code`; service-erp uses `reference`. Pick one. |
| relationship (client/equity/owned), parent_business_id | — | ❌ |
| is_customer, is_portfolio, relationships[] | — | ❌ |
| industry, contact_role | category, contact_* | 🟡 add industry, contact_role |
| social_linkedin/twitter/facebook/instagram/website | — | ❌ |
| tier (vip/premium/standard/basic) | — | ❌ |
| health_score (0–100) | — | ❌ |
| business_contacts (1:N) | — | ❌ |
| business_branches (1:N) | — | ❌ |
| communications (1:N) | — | ❌ |
| tags | — | ❌ |

### people
| Field (v2) | service-erp | Status |
|---|---|---|
| name (UNIQUE), code (UNIQUE) | name, code (nullable) | 🟡 make code NOT NULL UNIQUE |
| discipline, team | team, role | 🟡 replace/augment role with discipline |
| hourly_rate, weekly_hours | — | ❌ |
| classification, employment_type, compensation_model, resource_status | — | ❌ |
| tax_or_vendor_id, overtime_multiplier, max_billable_hours, monthly_salary | — | ❌ |
| payroll_schedule, allowance_limit, invoice_requirement | — | ❌ |
| tax_document_* , payable_schedule, bank_account_ref | — | ❌ |

## Phase 2 — Service catalogue parity

### services
| Field (v2) | service-erp | Status |
|---|---|---|
| service_type CHECK (project/managed_service/support/subscription) | service_type TEXT | 🟡 add CHECK |
| service_tags (M:N) | — | ❌ |
| service_request_templates | — | ❌ |
| recurring_requests | — | ❌ |

### attributes / attribute_values
| Field (v2) | service-erp | Status |
|---|---|---|
| display_type CHECK (pills/color/radio/select/image/multi_checkbox) | TEXT | 🟡 add CHECK |
| variant_creation CHECK | TEXT | 🟡 add CHECK |
| attribute_categories (table) | category TEXT | 🟡 optional normalization |

### service_variants
| Field (v2) | service-erp | Status |
|---|---|---|
| currency | ✅ | ✅ |
| generation CHECK | TEXT | 🟡 add CHECK |
| (cost present in both) | ✅ | ✅ |

## Phase 3 — Service request parity (largest gap)

v2 `service_requests` has many fields service-erp lacks. Key gaps:

| v2 field | service-erp | Status |
|---|---|---|
| requested_by | — | ❌ |
| contact_role | — | ❌ |
| assigned_to (TEXT name) vs assigned_to (FK people) | FK | 🟡 decide: keep FK (better) but expose name |
| required_date, special_requirements | required_date, description | 🟡 add special_requirements |
| variant_extra, additional_services | variant_price, — | 🟡 rename/align |
| discount_amount | — | ❌ (compute/store) |
| final_amount vs total_amount | total_amount | 🟡 align name |
| snapshot (JSON) | configuration | 🟡 add snapshot |
| resources[] | — | ❌ |
| deployment, delivery_summary, delivered_at, fulfilled_at | — | ❌ |
| closed_at | — | ❌ |
| branch_id (FK business_branches) | — | ❌ |
| scope_mode (single/multi), parent_request_id | — | ❌ |
| preferred_window | — | ❌ |
| retention_account_id | — | ❌ |
| request_lines (line items) | ✅ table exists | 🟡 API/UI missing |
| request_configuration | ✅ table exists | 🟡 API/UI missing |
| request_addons | ✅ table exists | 🟡 API/UI missing |
| request_attribute_selections | — | ❌ |
| request_tags | — | ❌ |
| request_events | ✅ | ✅ |
| request_assignments / allocations / cost_lines / tasks / effort | — | ❌ (workforce module) |
| recurring_requests | — | ❌ |

## Phase 4 — Help desk ticket parity

| v2 field | service-erp | Status |
|---|---|---|
| subject (NOT NULL) vs title | title | 🟡 align naming |
| description (NOT NULL) | description | ✅ |
| assigned_team, assigned_to (TEXT) | assigned_to FK | 🟡 expose name |
| contact_role | — | ❌ |
| resolution, resolution_summary | — | ❌ |
| variant_id | — | ❌ |
| ticket_relations (M:N) | — | ❌ |
| ticket_tags | — | ❌ |

## Phase 5 — UI/UX + architecture improvements (target better than v2)
- ✅ Glassmorphism design system applied
- ✅ App Router + server repositories (cleaner than v2's Express monolith)
- 🟡 Add missing pages/forms for new fields (business contacts, branches, people workforce, request wizard steps, ticket resolution)
- 🟡 Add validation (zod) on both client and server
- 🟡 Add tests (unit for repositories/domain, e2e for critical flows) — v2 has extensive tests; service-erp has none
- 🟡 Migrate Tailwind from CDN to build-time (Phase 4 of audit)
- 🟡 Add auth before exposing

## Phase 6 — Verification
- Add `npm run verify:all` equivalent: lint + typecheck + tests + build
- Fix production build (font module issue) so `next build` passes
- Seed demo data parity (`scripts/seed.ts`)

---

## Working method
1. Pick one entity per PR (e.g. "businesses parity").
2. Add columns/tables via idempotent migration in `src/lib/db.ts` (ALTER TABLE … ADD COLUMN guarded).
3. Update repository hydrate + CRUD.
4. Update API route validation.
5. Update UI forms/pages.
6. Run `npm run lint` and manual smoke test.

## Not in scope
Finance, expenses, leads, marketing, procurement, assets, equity, cash, offline/PWA, mobile-specific modules — unless explicitly pulled in later.
