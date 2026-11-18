'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface FormError {
  name?: string;
  description?: string;
  serviceType?: string;
  basePrice?: string;
  baseCost?: string;
  currency?: string;
  deliveryDays?: string;
  team?: string;
  active?: string;
  _global?: string;
}

interface FormValues {
  name: string;
  description: string;
  serviceType: string;
  basePrice: number;
  baseCost: number;
  currency: string;
  deliveryDays: number;
  team: string;
  active: boolean;
}

interface FormState {
  values: FormValues;
  errors: FormError;
  isSubmitting: boolean;
}

export default function NewServicePage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ name: '', description: '', serviceType: 'standard', basePrice: 0, baseCost: 0, currency: 'USD', deliveryDays: 5, team: 'General', active: true });
  const [errors, setErrors] = useState<FormError>({});

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(setServices);
  }, []);

  const onServiceChange = (sid: string) => {
    const s = services.find((x: any) => String(x.id) === sid);
  };

  const validate = (): boolean => {
    const newErrors: FormError = {};
    
    if (!form.name?.trim()) newErrors.name = 'Name is required';
    if (!form.description?.trim()) newErrors.description = 'Description is required';
    if (!form.serviceType) newErrors.serviceType = 'Service type is required';
    if (form.basePrice === undefined || form.basePrice < 0) newErrors.basePrice = 'Base price must be a positive number';
    if (form.baseCost === undefined || form.baseCost < 0) newErrors.baseCost = 'Base cost must be a positive number';
    if (!form.currency) newErrors.currency = 'Currency is required';
    if (form.deliveryDays === undefined || form.deliveryDays < 1) newErrors.deliveryDays = 'Delivery days must be at least 1';
    if (!form.team) newErrors.team = 'Team is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    
    setForm({ ...form, isSubmitting: true });
    try {
      const payload = { ...form };
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      router.push(`/services/${data.id}`);
      toast.success('Service created successfully!');
    } catch (error) {
      toast.error('Failed to create service. Please try again.');
      setErrors({ ...errors, _global: 'Failed to create service. Please try again.' });
    } finally {
      setForm({ ...form, isSubmitting: false });
    }
  };

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(setServices);
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/services" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
          <ArrowLeft size={20} aria-label="Back to Services" /> Back to Services
        </Link>
        <h1 className="text-2xl font-bold">New Service</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Service Details</CardTitle></CardHeader>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400" htmlFor="service-name">
              Name
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <Input
              id="service-name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              error={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400" htmlFor="service-description">
              Description
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <Input
              id="service-description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              error={errors.description ? true : undefined}
              aria-describedby={errors.description ? 'desc-error' : undefined}
            />
            {errors.description && (
              <p id="desc-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Service Type</label>
            <Select
              value={form.serviceType}
              onChange={e => setForm({ ...form, serviceType: e.target.value })}
              error={errors.serviceType ? true : undefined}
            >
              <option value="standard">Standard</option>
              <option value="recurring">Recurring</option>
              <option value="maintenance">Maintenance</option>
            </Select>
            {errors.serviceType && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.serviceType}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Base Price</label>
              <Input
                type="number"
                value={form.basePrice}
                onChange={e => setForm({ ...form, basePrice: Number(e.target.value) })}
                error={errors.basePrice ? true : undefined}
              />
              {errors.basePrice && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.basePrice}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Base Cost</label>
              <Input
                type="number"
                value={form.baseCost}
                onChange={e => setForm({ ...form, baseCost: Number(e.target.value) })}
                error={errors.baseCost ? true : undefined}
              />
              {errors.baseCost && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.baseCost}</p>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Currency</label>
            <Input
              value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}
              error={errors.currency ? true : undefined}
            />
            {errors.currency && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.currency}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Delivery Days</label>
              <Input
                type="number"
                value={form.deliveryDays}
                onChange={e => setForm({ ...form, deliveryDays: Number(e.target.value) })}
                error={errors.deliveryDays ? true : undefined}
              />
              {errors.deliveryDays && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.deliveryDays}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Team</label>
              <Input
                value={form.team}
                onChange={e => setForm({ ...form, team: e.target.value })}
                error={errors.team ? true : undefined}
              />
              {errors.team && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.team}</p>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600 dark:text-slate-400">Active</label>
            <Select
              value={form.active ? 'true' : 'false'}
              onChange={e => setForm({ ...form, active: e.target.value === 'true' })}
              error={errors.active ? true : undefined}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
            {errors.active && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.active}</p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={submit} className="w-full" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Creating...' : 'Create Service'}
          </Button>
        </div>
      </Card>
    </div>
  );
}