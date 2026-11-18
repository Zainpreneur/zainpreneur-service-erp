import { z } from 'zod';

export const BusinessSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  category: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  contactName: z.string().nullable().optional(),
  contactEmail: z.string().email().nullable().optional().or(z.literal('').transform(() => null)),
  contactPhone: z.string().nullable().optional(),
  contactRole: z.string().nullable().optional(),
  status: z.string().optional(),
  notes: z.string().nullable().optional(),
  relationship: z.string().optional(),
  parentBusinessId: z.number().nullable().optional(),
  isCustomer: z.boolean().optional(),
  isPortfolio: z.boolean().optional(),
  relationships: z.array(z.string()).optional(),
  industry: z.string().nullable().optional(),
  social: z.object({
    linkedin: z.string().nullable().optional(),
    twitter: z.string().nullable().optional(),
    facebook: z.string().nullable().optional(),
    instagram: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
  }).optional(),
  tier: z.string().nullable().optional(),
  healthScore: z.number().min(0).max(100).nullable().optional(),
});

export const PersonSchema = z.object({
  name: z.string().min(1),
  code: z.string().nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal('').transform(() => null)),
  phone: z.string().nullable().optional(),
  team: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  discipline: z.string().nullable().optional(),
  hourlyRate: z.number().optional(),
  weeklyHours: z.number().optional(),
  classification: z.string().optional(),
  employmentType: z.string().optional(),
  compensationModel: z.string().optional(),
  resourceStatus: z.string().optional(),
  taxOrVendorId: z.string().nullable().optional(),
  overtimeMultiplier: z.number().optional(),
  maxBillableHours: z.number().nullable().optional(),
  monthlySalary: z.number().nullable().optional(),
  payrollSchedule: z.string().nullable().optional(),
  allowanceLimit: z.number().nullable().optional(),
  invoiceRequirement: z.string().nullable().optional(),
  taxDocumentKind: z.string().nullable().optional(),
  taxDocumentStatus: z.string().optional(),
  taxDocumentExpires: z.string().nullable().optional(),
  payableSchedule: z.string().nullable().optional(),
  bankAccountRef: z.string().nullable().optional(),
});

export const ServiceSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  categoryId: z.number(),
  serviceType: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().optional(),
  baseCost: z.number().optional(),
  currency: z.string().optional(),
  deliveryDays: z.number().optional(),
  team: z.string().optional(),
  active: z.boolean().optional(),
});

export const TicketSchema = z.object({
  businessId: z.number(),
  serviceId: z.number().nullable().optional(),
  serviceRequestId: z.number().nullable().optional(),
  variantId: z.number().nullable().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  category: z.string().min(1),
  priority: z.string().optional(),
  status: z.string().optional(),
  assignedTo: z.number().nullable().optional(),
  assignedTeam: z.string().nullable().optional(),
  contactName: z.string().nullable().optional(),
  contactEmail: z.string().email().nullable().optional().or(z.literal('').transform(() => null)),
  contactPhone: z.string().nullable().optional(),
  contactRole: z.string().nullable().optional(),
  resolution: z.string().nullable().optional(),
  resolutionSummary: z.string().nullable().optional(),
  slaDueAt: z.string().nullable().optional(),
});

export const RequestSchema = z.object({
  businessId: z.number(),
  serviceId: z.number(),
  variantId: z.number().nullable().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.number().nullable().optional(),
  assignedTeam: z.string().nullable().optional(),
  contactName: z.string().nullable().optional(),
  contactEmail: z.string().email().nullable().optional().or(z.literal('').transform(() => null)),
  contactPhone: z.string().nullable().optional(),
  contactRole: z.string().nullable().optional(),
  requestedBy: z.string().optional(),
  requestedDate: z.string().nullable().optional(),
  requiredDate: z.string().nullable().optional(),
  scheduledDate: z.string().nullable().optional(),
  specialRequirements: z.string().nullable().optional(),
  basePrice: z.number().optional(),
  variantPrice: z.number().optional(),
  variantExtra: z.number().optional(),
  attributeExtras: z.number().optional(),
  configurationCharges: z.number().optional(),
  additionalServices: z.number().optional(),
  discountType: z.string().nullable().optional(),
  discountValue: z.number().optional(),
  discountAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  finalAmount: z.number().optional(),
  currency: z.string().optional(),
  deployment: z.string().nullable().optional(),
  deliverySummary: z.string().nullable().optional(),
  branchId: z.number().nullable().optional(),
  scopeMode: z.string().optional(),
  parentRequestId: z.number().nullable().optional(),
  preferredWindow: z.string().nullable().optional(),
  retentionAccountId: z.number().nullable().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  sequence: z.number().optional(),
});

export const ConfigRuleSchema = z.object({
  serviceId: z.number(),
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  fieldType: z.string().optional(),
  options: z.array(z.string()).optional(),
  isRequired: z.boolean().optional(),
  priceExtra: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const TagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
});

export const BusinessContactSchema = z.object({
  businessId: z.number(),
  name: z.string().min(1),
  role: z.string().nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal('').transform(() => null)),
  phone: z.string().nullable().optional(),
  isPrimary: z.boolean().optional(),
  notes: z.string().nullable().optional(),
});

export const BusinessBranchSchema = z.object({
  businessId: z.number(),
  name: z.string().min(1),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
});

export const RetentionAccountSchema = z.object({
  businessId: z.number(),
  name: z.string().min(1),
  accountRef: z.string().min(1),
  currency: z.string().optional(),
  primary: z.boolean().optional(),
});

export const ServiceAttributeSchema = z.object({
  serviceId: z.number(),
  attributeId: z.number(),
  required: z.boolean().optional(),
  variantCreating: z.boolean().optional(),
  sequence: z.number().optional(),
});

export const AttributeSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  displayType: z.string().optional(),
  variantCreation: z.string().optional(),
  allowCustomValue: z.boolean().optional(),
  description: z.string().nullable().optional(),
  sequence: z.number().optional(),
  active: z.boolean().optional(),
});

export const AttributeValueSchema = z.object({
  attributeId: z.number(),
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().nullable().optional(),
  priceExtra: z.number().optional(),
  color: z.string().nullable().optional(),
  isCustom: z.boolean().optional(),
  sequence: z.number().optional(),
  active: z.boolean().optional(),
});

export const ServiceVariantSchema = z.object({
  serviceId: z.number(),
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  price: z.number().optional(),
  cost: z.number().optional(),
  currency: z.string().optional(),
  deliveryDays: z.number().optional(),
  available: z.boolean().optional(),
  active: z.boolean().optional(),
  generation: z.string().optional(),
  values: z.array(z.object({ attributeId: z.number(), attributeValueId: z.number() })).optional(),
});

export const SupportInfoSchema = z.object({
  supportEmail: z.string().email().nullable().optional().or(z.literal('').transform(() => null)),
  supportPhone: z.string().nullable().optional(),
  supportHours: z.string().nullable().optional(),
  slaResponseTime: z.string().nullable().optional(),
});

export function parseBody(schema: z.ZodTypeAny, body: unknown): { ok: true; data: any } | { ok: false; error: string } {
  const r = schema.safeParse(body);
  if (r.success) return { ok: true, data: r.data };
  return { ok: false, error: r.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') };
}