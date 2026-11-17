# Zainpreneur Service ERP (Next.js)

A full-stack Next.js port of the Zainpreneur v2 **Service Request module**:
Service Catalogue → Service Request → Help Desk.

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- better-sqlite3 + SQLite
- Radix UI, Lucide, Sonner, Recharts

## Modules
- Services (catalogue, variants, attributes, configuration rules, support info)
- Attributes & Values
- Service Requests (list, detail, create, status workflow, timeline)
- Help Desk Tickets (conversation, status, SLA, timeline)
- Businesses & People

## Run
```bash
npm install
npm run db:seed   # optional: seed demo data
npm run dev
```
Open http://localhost:3000

## Repository
https://github.com/Zainpreneur/zainpreneur-service-erp