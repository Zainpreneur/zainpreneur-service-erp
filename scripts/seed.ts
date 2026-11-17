import db from '../src/lib/db';
import { createCategory, createService, createAttribute, createAttributeValue, setServiceAttribute, createVariant, createConfigRule, upsertSupportInfo } from '../src/lib/server/services';
import { createBusiness } from '../src/lib/server/businesses';
import { createPerson } from '../src/lib/server/people';
import { createRequest } from '../src/lib/server/requests';
import { createTicket } from '../src/lib/server/tickets';

const now = () => new Date().toISOString();

// people
const p1 = createPerson({ name: 'Alice Johnson', email: 'alice@zain.com', team: 'Support', role: 'Agent' });
const p2 = createPerson({ name: 'Bob Smith', email: 'bob@zain.com', team: 'Sales', role: 'Manager' });

// businesses
const b1 = createBusiness({ name: 'Acme Corp', category: 'Enterprise', city: 'New York', contactName: 'John Doe', contactEmail: 'john@acme.com', contactPhone: '+1-555-0100' });
const b2 = createBusiness({ name: 'Globex Inc', category: 'SMB', city: 'London', contactName: 'Jane Roe', contactEmail: 'jane@globex.com' });

// categories
const catIT = createCategory({ name: 'IT Services', code: 'IT', sequence: 1 });
const catConsult = createCategory({ name: 'Consulting', code: 'CONS', sequence: 2 });

// attributes
const attrColor = createAttribute({ code: 'color', name: 'Color', category: 'appearance', displayType: 'color', variantCreation: 'instantly', allowCustomValue: false, sequence: 1 });
const attrSize = createAttribute({ code: 'size', name: 'Size', category: 'dimensions', displayType: 'select', variantCreation: 'instantly', allowCustomValue: true, sequence: 2 });
const attrMaterial = createAttribute({ code: 'material', name: 'Material', category: 'material', displayType: 'select', variantCreation: 'no', allowCustomValue: false, sequence: 3 });

const red = createAttributeValue({ attributeId: attrColor.id, name: 'Red', code: 'red', color: '#ef4444', priceExtra: 0, sequence: 1 });
const blue = createAttributeValue({ attributeId: attrColor.id, name: 'Blue', code: 'blue', color: '#3b82f6', priceExtra: 5, sequence: 2 });
const small = createAttributeValue({ attributeId: attrSize.id, name: 'Small', code: 'sm', priceExtra: 0, sequence: 1 });
const large = createAttributeValue({ attributeId: attrSize.id, name: 'Large', code: 'lg', priceExtra: 10, sequence: 2 });
const cotton = createAttributeValue({ attributeId: attrMaterial.id, name: 'Cotton', code: 'cotton', priceExtra: 0, sequence: 1 });
const silk = createAttributeValue({ attributeId: attrMaterial.id, name: 'Silk', code: 'silk', priceExtra: 20, sequence: 2 });

// service 1
const svc1 = createService({ code: 'WEB-DEV', name: 'Website Development', categoryId: catIT.id, serviceType: 'project', summary: 'Custom website development service', description: 'Full-stack website development with modern tech.', basePrice: 2000, baseCost: 800, currency: 'USD', deliveryDays: 30, team: 'Engineering', active: true });
setServiceAttribute(svc1.id, attrColor.id, { required: false, variantCreating: true, sequence: 1 });
setServiceAttribute(svc1.id, attrSize.id, { required: true, variantCreating: true, sequence: 2 });
createVariant({ serviceId: svc1.id, code: 'WEB-DEV-RED-SM', name: 'Website - Red / Small', price: 2000, cost: 800, values: [{ attributeId: attrColor.id, attributeValueId: red.id }, { attributeId: attrSize.id, attributeValueId: small.id }] });
createVariant({ serviceId: svc1.id, code: 'WEB-DEV-BLUE-LG', name: 'Website - Blue / Large', price: 2100, cost: 850, values: [{ attributeId: attrColor.id, attributeValueId: blue.id }, { attributeId: attrSize.id, attributeValueId: large.id }] });
createConfigRule({ serviceId: svc1.id, code: 'hosting', name: 'Hosting Plan', fieldType: 'select', options: ['Basic', 'Pro', 'Enterprise'], isRequired: true, priceExtra: 0 });
upsertSupportInfo(svc1.id, { supportEmail: 'support@zain.com', supportPhone: '+1-555-9999', supportHours: '9-5 M-F', slaResponseTime: '24h' });

// service 2
const svc2 = createService({ code: 'CONSULT', name: 'Business Consulting', categoryId: catConsult.id, serviceType: 'hourly', summary: 'Expert business consulting', description: 'Strategic consulting hours.', basePrice: 150, baseCost: 60, currency: 'USD', deliveryDays: 7, team: 'Consulting', active: true });
setServiceAttribute(svc2.id, attrMaterial.id, { required: false, variantCreating: false, sequence: 1 });
createConfigRule({ serviceId: svc2.id, code: 'hours', name: 'Estimated Hours', fieldType: 'number', isRequired: true, priceExtra: 0 });

// requests
const r1 = createRequest({
  businessId: b1.id, serviceId: svc1.id, variantId: null, title: 'New corporate website', description: 'Build a modern corporate site', status: 'in_progress', priority: 'high', assignedTo: p1.id, assignedTeam: 'Engineering', contactName: 'John Doe', contactEmail: 'john@acme.com', requiredDate: '2026-12-01', basePrice: 2000, totalAmount: 2000, currency: 'USD', configuration: { hosting: 'Pro' }, addOns: [{ name: 'SEO Package', price: 300, quantity: 1 }],
});
const r2 = createRequest({ businessId: b2.id, serviceId: svc2.id, title: 'Q4 strategy review', status: 'new', priority: 'normal', contactName: 'Jane Roe', basePrice: 150, totalAmount: 150 });

// tickets
createTicket({ businessId: b1.id, serviceId: svc1.id, serviceRequestId: r1.id, title: 'Website login issue', description: 'Users cannot log in', type: 'incident', category: 'technical', priority: 'urgent', status: 'new', contactName: 'John Doe', contactEmail: 'john@acme.com', slaDueAt: new Date(Date.now()+24*3600*1000).toISOString() });
createTicket({ businessId: b2.id, title: 'Billing question', description: 'Invoice discrepancy', type: 'question', category: 'billing', priority: 'normal', status: 'open', contactName: 'Jane Roe' });

console.log('Seed complete');

