export type Status = string;

export interface Person {
  id: number;
  code?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  team?: string | null;
  role?: string | null;
  isActive: boolean;
  createdAt: string;
  discipline?: string | null;
  hourlyRate?: number;
  weeklyHours?: number;
  classification?: string;
  employmentType?: string;
  compensationModel?: string;
  resourceStatus?: string;
  taxOrVendorId?: string | null;
  overtimeMultiplier?: number;
  maxBillableHours?: number | null;
  monthlySalary?: number | null;
  payrollSchedule?: string | null;
  allowanceLimit?: number | null;
  invoiceRequirement?: string | null;
  taxDocumentKind?: string | null;
  taxDocumentStatus?: string;
  taxDocumentExpires?: string | null;
  payableSchedule?: string | null;
  bankAccountRef?: string | null;
}

export interface BusinessContact {
  id: number;
  businessId: number;
  name: string;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
  createdAt: string;
}

export interface Business {
  reference: string;
  code?: string | null;
  name: string;
  category?: string | null;
  city?: string | null;
  country?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactRole?: string | null;
  status: string;
  notes?: string | null;
  relationship?: string | null;
  parentBusinessId?: number | null;
  isCustomer?: boolean;
  isPortfolio?: boolean;
  relationships?: string[];
  industry?: string | null;
  social?: { linkedin?: string | null; twitter?: string | null; facebook?: string | null; instagram?: string | null; website?: string | null };
  tier?: string | null;
  healthScore?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  code: string;
  sequence: number;
  archivedAt?: string | null;
  createdAt: string;
}

export interface Service {
  id: number;
  code: string;
  name: string;
  categoryId: number;
  categoryName?: string;
  serviceType: string;
  summary: string;
  description: string;
  basePrice: number;
  baseCost: number;
  currency: string;
  deliveryDays: number;
  team: string;
  active: boolean;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Attribute {
  id: number;
  code: string;
  name: string;
  category: string;
  displayType: string;
  variantCreation: string;
  allowCustomValue: boolean;
  description?: string | null;
  sequence: number;
  active: boolean;
  archivedAt?: string | null;
}

export interface AttributeValue {
  id: number;
  attributeId: number;
  name: string;
  code: string;
  description?: string | null;
  priceExtra: number;
  color?: string | null;
  isCustom: boolean;
  sequence: number;
  active: boolean;
  archivedAt?: string | null;
}

export interface ServiceAttribute {
  serviceId: number;
  attributeId: number;
  required: boolean;
  variantCreating: boolean;
  sequence: number;
}

export interface ServiceVariant {
  id: number;
  serviceId: number;
  code: string;
  name: string;
  description?: string | null;
  price: number;
  cost: number;
  currency: string;
  deliveryDays: number;
  available: boolean;
  active: boolean;
  archivedAt?: string | null;
  generation: string;
  createdAt: string;
  values?: { attributeId: number; attributeValueId: number }[];
}

export interface ConfigurationRule {
  id: number;
  serviceId: number;
  code: string;
  name: string;
  description?: string | null;
  fieldType: string;
  options: string[];
  isRequired: boolean;
  priceExtra: number;
  isActive: boolean;
  createdAt: string;
}

export interface SupportInfo {
  id: number;
  serviceId: number;
  supportEmail?: string | null;
  supportPhone?: string | null;
  supportHours?: string | null;
  slaResponseTime?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: number;
  reference: string;
  businessId: number;
  businessName?: string;
  serviceId: number;
  serviceName?: string;
  variantId?: number | null;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assignedTo?: number | null;
  assignedToName?: string | null;
  assignedTeam?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactRole?: string | null;
  requestedBy?: string | null;
  requestedDate?: string | null;
  requiredDate?: string | null;
  scheduledDate?: string | null;
  specialRequirements?: string | null;
  completedAt?: string | null;
  closedAt?: string | null;
  deliveredAt?: string | null;
  fulfilledAt?: string | null;
  selectedVariants: number[];
  configuration: Record<string, unknown>;
  addOns: { id?: number; name: string; description?: string; price: number; quantity: number }[];
  basePrice: number;
  variantPrice: number;
  variantExtra?: number;
  attributeExtras: number;
  configurationCharges: number;
  additionalServices?: number;
  discountType?: string | null;
  discountValue: number;
  discountAmount?: number;
  totalAmount: number;
  finalAmount?: number;
  currency: string;
  snapshot?: Record<string, unknown>;
  resources?: unknown[];
  deployment?: string | null;
  deliverySummary?: string | null;
  branchId?: number | null;
  scopeMode?: string;
  parentRequestId?: number | null;
  preferredWindow?: string | null;
  retentionAccountId?: number | null;
  createdAt: string;
  updatedAt: string;
  lineItems?: RequestLineItem[];
  configEntries?: RequestConfiguration[];
  events?: RequestEvent[];
}

export interface RequestLineItem {
  id: number;
  requestId: number;
  serviceId: number;
  variantId?: number | null;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: string;
}

export interface RequestConfiguration {
  id: number;
  requestId: number;
  attributeId: number;
  attributeValueId?: number | null;
  customValue?: string | null;
  priceExtra: number;
  createdAt: string;
}

export interface RequestEvent {
  id: number;
  requestId: number;
  eventType: string;
  actor: string;
  note?: string | null;
  createdAt: string;
}

export interface HelpdeskTicket {
  id: number;
  reference: string;
  businessId: number;
  businessName?: string;
  serviceId?: number | null;
  serviceName?: string;
  serviceRequestId?: number | null;
  requestReference?: string;
  variantId?: number | null;
  title: string;
  description?: string | null;
  type: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: number | null;
  assignedToName?: string | null;
  assignedTeam?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactRole?: string | null;
  resolution?: string | null;
  resolutionSummary?: string | null;
  slaDueAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
  events?: TicketEvent[];
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  author: string;
  authorRole: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketEvent {
  id: number;
  ticketId: number;
  eventType: string;
  actor: string;
  note?: string | null;
  createdAt: string;
}

export interface ServiceRequestInput {
  businessId: number;
  serviceId: number;
  variantId?: number | null;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignedTo?: number | null;
  assignedTeam?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  requestedDate?: string;
  requiredDate?: string;
  scheduledDate?: string;
  selectedVariants?: number[];
  configuration?: Record<string, unknown>;
  addOns?: { name: string; description?: string; price: number; quantity: number }[];
  basePrice?: number;
  variantPrice?: number;
  attributeExtras?: number;
  configurationCharges?: number;
  discountType?: string | null;
  discountValue?: number;
  discountAmount?: number;
  totalAmount?: number;
  finalAmount?: number;
  currency?: string;
  contactRole?: string;
  requestedBy?: string;
  specialRequirements?: string;
  variantExtra?: number;
  additionalServices?: number;
  snapshot?: Record<string, unknown>;
  resources?: unknown[];
  deployment?: string;
  deliverySummary?: string;
  branchId?: number | null;
  scopeMode?: string;
  parentRequestId?: number | null;
  preferredWindow?: string;
  retentionAccountId?: number | null;
  closedAt?: string;
  deliveredAt?: string;
  fulfilledAt?: string;
}

export interface CategoryInput {
  name: string;
  code: string;
  sequence?: number;
}

export interface ConfigRuleInput {
  serviceId: number;
  code: string;
  name: string;
  description?: string | null;
  fieldType?: string;
  options?: string[];
  isRequired?: boolean;
  priceExtra?: number;
  isActive?: boolean;
}

export interface TagInput {
  name: string;
  slug?: string;
}

export interface BusinessContactInput {
  businessId: number;
  name: string;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
}

export interface BusinessBranchInput {
  businessId: number;
  name: string;
  city?: string | null;
  country?: string | null;
}

export interface RetentionAccountInput {
  businessId: number;
  name: string;
  accountRef: string;
  currency?: string;
  primary?: boolean;
}

export interface ServiceAttributeInput {
  serviceId: number;
  attributeId: number;
  required?: boolean;
  variantCreating?: boolean;
  sequence?: number;
}

export interface TicketInput {
  businessId: number;
  serviceId?: number | null;
  serviceRequestId?: number | null;
  variantId?: number | null;
  title: string;
  description?: string;
  type: string;
  category: string;
  priority?: string;
  status?: string;
  assignedTo?: number | null;
  assignedTeam?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactRole?: string;
  resolution?: string;
  resolutionSummary?: string;
  slaDueAt?: string;
}
