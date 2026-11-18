'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface FormError {
  businessId?: string;
  serviceId?: string;
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  contactName?: string;
  contactEmail?: string;
  requiredDate?: string;
  basePrice?: string;
  totalAmount?: string;
  currency?: string;
  _global?: string;
}

interface FormValues {
  businessId: string;
  serviceId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  contactName: string;
  contactEmail: string;
  requiredDate: string;
  basePrice: number;
  totalAmount: number;
  currency: string;
}

interface FormState {
  values: FormValues;
  errors: FormError;
  isSubmitting: boolean;
}

export default function NewRequestPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ businessId: '', serviceId: '', title: '', description: '', priority: 'normal', status: 'draft', contactName: '', contactEmail: '', requiredDate: '', basePrice: 0, totalAmount: 0, currency: 'USD' });
  const [errors, setErrors] = useState<FormError>({});

  useEffect(() => {
    fetch('/api/businesses').then(r => r.json()).then(setBusinesses);
    fetch('/api/services').then(r => r.json()).then(setServices);
  }, []);

  const validate = (): boolean => {
    const newErrors: FormError = {};
    
    if (!form.businessId) newErrors.businessId = 'Business is required';
    if (!form.serviceId) newErrors.serviceId = 'Service is required';
    if (!form.title?.trim()) newErrors.title = 'Title is required';
    if (!form.description?.trim()) newErrors.description = 'Description is required';
    if (!form.priority) newErrors.priority = 'Priority is required';
    if (form.priority && !['low', 'normal', 'high', 'urgent'].includes(form.priority)) newErrors.priority = 'Invalid priority';
    if (!form.status) newErrors.status = 'Status is required';
    if (form.status && !['draft', 'new', 'in_progress'].includes(form.status)) newErrors.status = 'Invalid status';
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
    
    setForm({ ...form, isSubmitting: true });
    try {
      const payload = { ...form };
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      router.push(`/requests/${data.id}`);
      toast.success('Request created successfully!');
    } catch (error) {
      toast.error('Failed to create request. Please try again.');
      setErrors({ ...errors, _global: 'Failed to create request. Please try again.' });
    } finally {
      setForm({ ...form, isSubmitting: false });
    }
  };

  useEffect(() => {
    fetch('/api/businesses').then(r => r.json()).then(setBusinesses);
    fetch('/api/services').then(r => r.json()).then(setServices);
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/requests" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
          <ArrowLeft size={20} aria-label="Back to Requests" /> Back to Requests
        </Link>
        <h1 className="text-2xl font-bold">New Service Request</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Request Details</CardTitle></CardHeader>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400" htmlFor="request-business">
              Business
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <Select
              value={form.businessId}
              onChange={e => setForm({ ...form, businessId: e.target.value })}
              error={errors.businessId ? true : undefined}
              aria-describedby={errors.businessId ? 'business-error' : undefined}
            >
              <option value="">Select business</option>
              {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
            {errors.businessId && (
              <p id="business-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.businessId}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400" htmlFor="request-service">
              Service
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <Select
              value={form.serviceId}
              onChange={e => setForm({ ...form, serviceId: e.target.value })}
              error={errors.serviceId ? true : undefined}
              aria-describedby={errors.serviceId ? 'service-error' : undefined}
            >
              <option value="">Select service</option>
              {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            {errors.serviceId && (
              <p id="service-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.serviceId}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400" htmlFor="request-title">
              Title
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <Input
              id="request-title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              error={errors.title ? true : undefined}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400" htmlFor="request-description">
              Description
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <Textarea
              rows={4}
              id="request-description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              error={errors.description ? true : undefined}
              aria-describedby={errors.description ? 'desc-error' : undefined}
            />
            {errors.description && (
              <p id="desc-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Priority</label>
              <Select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                error={errors.priority ? true : undefined}
              >
                <option value="low">Low</option>
                <option value="normal" selected="">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
              {errors.priority && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.priority}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Status</label>
              <Select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                error={errors.status ? true : undefined}
              >
                <option value="draft" selected="">Draft</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
              </Select>
              {errors.status && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.status}</p>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400" htmlFor="request-contact-name">
              Contact Name
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <Input
              id="request-contact-name"
              value={form.contactName}
              onChange={e => setForm({ ...form, contactName: e.target.value })}
              error={errors.contactName ? true : undefined}
              aria-describedby={errors.contactName ? 'contact-name-error' : undefined}
            />
            {errors.contactName && (
              <p id="contact-name-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.contactName}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400" htmlFor="request-contact-email">
              Contact Email
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <Input
              id="request-contact-email"
              value={form.contactEmail}
              onChange={e => setForm({ ...form, contactEmail: e.target.value })}
              error={errors.contactEmail ? true : undefined}
              aria-describedby={errors.contactEmail ? 'contact-email-error' : undefined}
            />
            {errors.contactEmail && (
              <p id="contact-email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.contactEmail}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400" htmlFor="request-required-date">
              Required Date
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <Input type="date"
              id="request-required-date"
              value={form.requiredDate}
              onChange={e => setForm({ ...form, requiredDate: e.target.value })}
              error={errors.requiredDate ? true : undefined}
              aria-describedby={errors.requiredDate ? 'required-date-error' : undefined}
            />
            {errors.requiredDate && (
              <p id="required-date-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.requiredDate}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Base Price</label>
              <Input type="number"
                value={form.basePrice}
                onChange={e => setForm({ ...form, basePrice: Number(e.target.value) })}
                error={errors.basePrice ? true : undefined}
              />
              {errors.basePrice && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.basePrice}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Total Amount</label>
              <Input type="number"
                value={form.totalAmount}
                onChange={e => setForm({ ...form, totalAmount: Number(e.target.value) })}
                error={errors.totalAmount ? true : undefined}
              />
              {errors.totalAmount && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.totalAmount}</p>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Currency</label>
            <Input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} />
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={submit} className="w-full" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Creating...' : 'Create Request'}
          </Button>
        </div>
      </Card>
    </div>
  );
}