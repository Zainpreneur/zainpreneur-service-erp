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
}

export interface Business {
  id: number;
  reference: string;
  name: string;
  category?: string | null;
  city?: string | null;
  country?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  status: string;
  notes?: string | null;
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
  requestedDate?: string | null;
  requiredDate?: string | null;
  scheduledDate?: string | null;
  completedAt?: string | null;
  selectedVariants: number[];
  configuration: Record<string, unknown>;
  addOns: { id?: number; name: string; description?: string; price: number; quantity: number }[];
  basePrice: number;
  variantPrice: number;
  attributeExtras: number;
  configurationCharges: number;
  discountType?: string | null;
  discountValue: number;
  totalAmount: number;
  currency: string;
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
  title: string;
  description?: string | null;
  type: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: number | null;
  assignedToName?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
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
  totalAmount?: number;
  currency?: string;
}

export interface TicketInput {
  businessId: number;
  serviceId?: number | null;
  serviceRequestId?: number | null;
  title: string;
  description?: string;
  type: string;
  category: string;
  priority?: string;
  status?: string;
  assignedTo?: number | null;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  slaDueAt?: string;
}
