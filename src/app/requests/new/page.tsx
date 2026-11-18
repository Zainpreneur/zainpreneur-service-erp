'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput, TextArea, Select, Checkbox } from '@/components/ui/Form';
import { Plus } from 'lucide-react';

const PRIORITIES = ['low', 'normal', 'high', 'urgent'];
const STATUSES = ['draft', 'new', 'in_progress', 'completed', 'cancelled'];
const SCOPE_MODES = ['single', 'multi'];

export default function NewRequestPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    businessId: '', serviceId: '', title: '', description: '', priority: 'normal', status: 'draft',
    contactName: '', contactEmail: '', contactRole: '', requestedBy: 'Zainpreneur', specialRequirements: '',
    requiredDate: '', basePrice: 0, variantPrice: 0, attributeExtras: 0, configurationCharges: 0,
    additionalServices: 0, discountType: '', discountValue: 0, discountAmount: 0, totalAmount: 0,
    finalAmount: 0, currency: 'USD', deployment: '', deliverySummary: '', scopeMode: 'single',
    preferredWindow: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/businesses').then(r => r.json()).then(setBusinesses);
    fetch('/api/services').then(r => r.json()).then(setServices);
  }, []);

  const validate = (): boolean => {
    const newErrors: any = {};
    if (!form.businessId) newErrors.businessId = 'Business is required';
    if (!form.serviceId) newErrors.serviceId = 'Service is required';
    if (!form.title?.trim()) newErrors.title = 'Title is required';
    if (!form.description?.trim()) newErrors.description = 'Description is required';
    if (!form.priority) newErrors.priority = 'Priority is required';
    if (form.priority && !PRIORITIES.includes(form.priority)) newErrors.priority = 'Invalid priority';
    if (!form.status) newErrors.status = 'Status is required';
    if (form.status && !STATUSES.includes(form.status)) newErrors.status = 'Invalid status';
    if (!form.contactName?.trim()) newErrors.contactName = 'Contact name is required';
    if (!form.contactEmail?.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!form.requiredDate) newErrors.requiredDate = 'Required date is required';
    if (form.basePrice === undefined || form.basePrice < 0) newErrors.basePrice = 'Base price must be a positive number';
    if (form.totalAmount === undefined || form.totalAmount < 0) newErrors.totalAmount = 'Total amount must be a positive number';
    if (!form.currency) newErrors.currency = 'Currency is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...form };
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      router.push(`/requests/${data.id}`);
      toast.success('Request created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create request. Please try again.');
      setErrors((p: any) => ({ ...p, _global: error.message || 'Failed to create request. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="New Service Request"
        back={{ href: '/requests', label: 'Back to Requests' }}
        action={<Button onClick={submit} disabled={isSubmitting} className="w-auto">{isSubmitting ? 'Creating...' : 'Create Request'}</Button>}
      />

      {errors._global && (
        <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/10 p-4">
          <p className="text-sm text-rose-700 dark:text-rose-300">{errors._global}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="space-y-5">
          <FormSection title="Request details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Business" required>
                <Select id="req-business" value={form.businessId} onChange={value => setForm({ ...form, businessId: value })}>
                  <option value="">Select business</option>
                  {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </Select>
                {errors.businessId && <p className="error-text">{errors.businessId}</p>}
              </Field>
              <Field label="Service" required>
                <Select id="req-service" value={form.serviceId} onChange={value => setForm({ ...form, serviceId: value })}>
                  <option value="">Select service</option>
                  {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
                {errors.serviceId && <p className="error-text">{errors.serviceId}</p>}
              </Field>
              <Field label="Title" required>
                <TextInput id="req-title" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                {errors.title && <p className="error-text">{errors.title}</p>}
              </Field>
              <Field label="Status">
                <Select id="req-status" value={form.status} onChange={value => setForm({ ...form, status: value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </Select>
                {errors.status && <p className="error-text">{errors.status}</p>}
              </Field>
              <Field label="Priority">
                <Select id="req-priority" value={form.priority} onChange={value => setForm({ ...form, priority: value })}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
                {errors.priority && <p className="error-text">{errors.priority}</p>}
              </Field>
              <Field label="Requested By">
                <TextInput id="req-requestedBy" placeholder="Zainpreneur" value={form.requestedBy} onChange={e => setForm({ ...form, requestedBy: e.target.value })} />
              </Field>
              <Field label="Required Date" type="date">
                <TextInput id="req-requiredDate" type="date" value={form.requiredDate} onChange={e => setForm({ ...form, requiredDate: e.target.value })} />
                {errors.requiredDate && <p className="error-text">{errors.requiredDate}</p>}
              </Field>
              <Field label="Deployment">
                <TextInput id="req-deployment" placeholder="Deployment" value={form.deployment} onChange={e => setForm({ ...form, deployment: e.target.value })} />
              </Field>
              <Field label="Scope Mode">
                <Select id="req-scopeMode" value={form.scopeMode} onChange={value => setForm({ ...form, scopeMode: value })}>
                  {SCOPE_MODES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
            </div>
          </FormSection>

          <FormSection title="Contact">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Contact Name" required>
                <TextInput id="req-contactName" placeholder="Contact name" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
                {errors.contactName && <p className="error-text">{errors.contactName}</p>}
              </Field>
              <Field label="Contact Role">
                <TextInput id="req-contactRole" placeholder="Role" value={form.contactRole} onChange={e => setForm({ ...form, contactRole: e.target.value })} />
              </Field>
              <Field label="Contact Email" type="email" required>
                <TextInput id="req-contactEmail" type="email" placeholder="Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
                {errors.contactEmail && <p className="error-text">{errors.contactEmail}</p>}
              </Field>
              <Field label="Contact Phone" type="tel">
                <TextInput id="req-contactPhone" type="tel" placeholder="Phone" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} />
              </Field>
              <Field label="Preferred Window">
                <TextInput id="req-preferredWindow" placeholder="Window" value={form.preferredWindow} onChange={e => setForm({ ...form, preferredWindow: e.target.value })} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Description & requirements">
            <Field label="Description" required>
              <TextArea id="req-description" rows={4} placeholder="Describe the service request..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              {errors.description && <p className="error-text">{errors.description}</p>}
            </Field>
            <Field label="Special Requirements">
              <TextArea id="req-specialRequirements" rows={3} placeholder="Special requirements..." value={form.specialRequirements} onChange={e => setForm({ ...form, specialRequirements: e.target.value })} />
            </Field>
          </FormSection>

          <FormSection title="Pricing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Base Price">
                <TextInput id="req-basePrice" type="number" value={String(form.basePrice || 0)} onChange={e => setForm({ ...form, basePrice: Number(e.target.value) })} />
                {errors.basePrice && <p className="error-text">{errors.basePrice}</p>}
              </Field>
              <Field label="Variant Price">
                <TextInput id="req-variantPrice" type="number" value={String(form.variantPrice || 0)} onChange={e => setForm({ ...form, variantPrice: Number(e.target.value) })} />
              </Field>
              <Field label="Attribute Extras">
                <TextInput id="req-attributeExtras" type="number" value={String(form.attributeExtras || 0)} onChange={e => setForm({ ...form, attributeExtras: Number(e.target.value) })} />
              </Field>
              <Field label="Configuration Charges">
                <TextInput id="req-configurationCharges" type="number" value={String(form.configurationCharges || 0)} onChange={e => setForm({ ...form, configurationCharges: Number(e.target.value) })} />
              </Field>
              <Field label="Additional Services">
                <TextInput id="req-additionalServices" type="number" value={String(form.additionalServices || 0)} onChange={e => setForm({ ...form, additionalServices: Number(e.target.value) })} />
              </Field>
              <Field label="Discount Type">
                <Select id="req-discountType" value={form.discountType} onChange={value => setForm({ ...form, discountType: value })}>
                  <option value="">None</option>
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed</option>
                </Select>
              </Field>
              <Field label="Discount Value">
                <TextInput id="req-discountValue" type="number" value={String(form.discountValue || 0)} onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })} />
              </Field>
              <Field label="Discount Amount">
                <TextInput id="req-discountAmount" type="number" value={String(form.discountAmount || 0)} onChange={e => setForm({ ...form, discountAmount: Number(e.target.value) })} />
              </Field>
              <Field label="Total Amount" required>
                <TextInput id="req-totalAmount" type="number" value={String(form.totalAmount || 0)} onChange={e => setForm({ ...form, totalAmount: Number(e.target.value) })} />
                {errors.totalAmount && <p className="error-text">{errors.totalAmount}</p>}
              </Field>
              <Field label="Final Amount">
                <TextInput id="req-finalAmount" type="number" value={String(form.finalAmount || 0)} onChange={e => setForm({ ...form, finalAmount: Number(e.target.value) })} />
              </Field>
              <Field label="Currency">
                <Select id="req-currency" value={form.currency} onChange={value => setForm({ ...form, currency: value })}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                  <option value="AED">AED</option>
                </Select>
                {errors.currency && <p className="error-text">{errors.currency}</p>}
              </Field>
            </div>
          </FormSection>
        </div>
        <FormFooter>
          <Button variant="secondary" type="button" onClick={() => router.push('/requests')}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Request'}</Button>
        </FormFooter>
      </form>
    </div>
  );
}