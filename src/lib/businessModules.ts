export type BusinessCategoryId =
  | 'all'
  | 'services'
  | 'retail'
  | 'wholesale'
  | 'manufacturing'
  | 'restaurant'
  | 'healthcare'
  | 'construction';

export interface BusinessCategory {
  id: BusinessCategoryId;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
  allowedModuleIds: string[];
}

export interface ERPModule {
  id: string;
  label: string;
  shortDesc: string;
  href: string;
  iconName: string;
  group: 'Core & Ops' | 'Supply & Trade' | 'Production & Delivery' | 'People & Finance' | 'Administration';
  badge?: string;
}

export const ERP_MODULES: ERPModule[] = [
  { id: 'dashboard', label: 'Dashboard', shortDesc: 'Executive KPIs & real-time metrics', href: '/dashboard', iconName: 'LayoutDashboard', group: 'Core & Ops' },
  { id: 'services', label: 'Service Catalogue', shortDesc: 'Services, variants, attributes & configuration rules', href: '/services', iconName: 'Package', group: 'Core & Ops' },
  { id: 'requests', label: 'Service Requests', shortDesc: 'Service request lifecycle, status workflow & timeline', href: '/requests', iconName: 'FileText', group: 'Core & Ops', badge: 'Live' },
  { id: 'tickets', label: 'Help Desk', shortDesc: 'Conversations, SLA, resolution & timeline', href: '/tickets', iconName: 'Ticket', group: 'Core & Ops' },
  { id: 'businesses', label: 'Businesses', shortDesc: 'Customers, accounts, contacts & branches', href: '/businesses', iconName: 'Building2', group: 'Core & Ops' },
  { id: 'people', label: 'People', shortDesc: 'Staff, workforce, disciplines & assignments', href: '/people', iconName: 'Users', group: 'People & Finance' },
  { id: 'attributes', label: 'Attributes', shortDesc: 'Product/service attributes, values & configuration', href: '/attributes', iconName: 'Layers', group: 'Administration' },
  { id: 'variants', label: 'Variants', shortDesc: 'Service variants, pricing & attribute values', href: '/variants', iconName: 'Package', group: 'Supply & Trade' },
  { id: 'config-rules', label: 'Config Rules', shortDesc: 'Service configuration fields & pricing', href: '/config-rules', iconName: 'SlidersHorizontal', group: 'Administration' },
  { id: 'retention-accounts', label: 'Retention Accounts', shortDesc: 'Withheld payment holding accounts per business', href: '/retention-accounts', iconName: 'Banknote', group: 'People & Finance' },
  { id: 'business-branches', label: 'Business Branches', shortDesc: 'Branch locations per business', href: '/business-branches', iconName: 'Building', group: 'Supply & Trade' },
  { id: 'tags', label: 'Tags', shortDesc: 'Cross-entity tagging & filtering', href: '/tags', iconName: 'Tag', group: 'Administration' },
];

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'all',
    name: 'Enterprise Master (All Modules)',
    tagline: 'Complete Enterprise Suite',
    description: 'All modules enabled across operations, finance, HR, and supply chain.',
    iconName: 'Layers',
    color: 'from-violet-500 to-fuchsia-500',
    badgeBg: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    allowedModuleIds: ERP_MODULES.map(m => m.id),
  },
  {
    id: 'services',
    name: 'Service Business',
    tagline: 'Service Catalogue → Request → Help Desk',
    description: 'Tailored for service businesses: catalogue, requests, tickets, customers & staff.',
    iconName: 'Briefcase',
    color: 'from-indigo-500 to-violet-500',
    badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    allowedModuleIds: [
      'dashboard', 'services', 'requests', 'tickets', 'businesses', 'people', 'attributes', 'variants',
      'config-rules', 'tags', 'settings',
    ],
  },
  {
    id: 'retail',
    name: 'Retail & Trade',
    tagline: 'B2B Sales & Inventory',
    description: 'Focused on products, variants, orders, customers & procurement.',
    iconName: 'Truck',
    color: 'from-blue-500 to-cyan-500',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    allowedModuleIds: [
      'dashboard', 'services', 'requests', 'businesses', 'people', 'variants', 'tags', 'retention-accounts',
      'business-branches', 'settings',
    ],
  },
  {
    id: 'wholesale',
    name: 'Wholesale & Distribution',
    tagline: 'B2B Logistics & High-Volume Trading',
    description: 'For distributors & warehouses: bulk inventory, POs, multi-warehouse routing, logistics.',
    iconName: 'Warehouse',
    color: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    allowedModuleIds: [
      'dashboard', 'services', 'requests', 'tickets', 'businesses', 'people', 'variants', 'tags',
      'retention-accounts', 'business-branches', 'settings',
    ],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    tagline: 'Factory & Production',
    description: 'BOM, work orders, quality & production scheduling.',
    iconName: 'Factory',
    color: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    allowedModuleIds: [
      'dashboard', 'services', 'requests', 'businesses', 'people', 'variants', 'tags', 'retention-accounts',
      'business-branches', 'settings',
    ],
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Hospitality',
    tagline: 'Fast POS & Food Service',
    description: 'Purpose-built for food service, bakeries & dining venues.',
    iconName: 'Store',
    color: 'from-rose-500 to-pink-500',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    allowedModuleIds: [
      'dashboard', 'services', 'requests', 'businesses', 'people', 'tags', 'retention-accounts', 'settings',
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare Clinic',
    tagline: 'Patient Records & Compliance',
    description: 'Patient CRM, pharmaceutical inventory, strict audit trails.',
    iconName: 'Shield',
    color: 'from-teal-500 to-emerald-500',
    badgeBg: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    allowedModuleIds: [
      'dashboard', 'services', 'requests', 'tickets', 'businesses', 'people', 'tags', 'audit', 'settings',
    ],
  },
  {
    id: 'construction',
    name: 'Construction',
    tagline: 'Job Costing & Milestones',
    description: 'Project milestones, subcontractors & job costing.',
    iconName: 'FolderKanban',
    color: 'from-yellow-500 to-amber-600',
    badgeBg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    allowedModuleIds: [
      'dashboard', 'services', 'requests', 'tickets', 'businesses', 'people', 'tags', 'retention-accounts',
      'business-branches', 'settings',
    ],
  },
];

export const STORAGE_KEY_CATEGORY = 'zainpreneur_active_business_category';
export const STORAGE_KEY_CUSTOM_MODULES = 'zainpreneur_custom_modules_overrides';

export function getInitialCategory(): BusinessCategoryId {
  if (typeof window === 'undefined') return 'services';
  const saved = localStorage.getItem(STORAGE_KEY_CATEGORY);
  if (saved && BUSINESS_CATEGORIES.some(c => c.id === saved)) {
    return saved as BusinessCategoryId;
  }
  return 'services';
}

export function getCategoryById(id: BusinessCategoryId): BusinessCategory | undefined {
  return BUSINESS_CATEGORIES.find(c => c.id === id);
}
