'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Layers } from 'lucide-react';

export default function AttributesPage() {
  const [attrs, setAttrs] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const [newAttr, setNewAttr] = useState({ code: '', name: '', category: 'general', displayType: 'select', variantCreation: 'no' });
  const [newValue, setNewValue] = useState({ attributeId: '', name: '', code: '', priceExtra: 0 });

  const load = () => {
    fetch('/api/attributes').then(r => r.json()).then((d) => setAttrs(Array.isArray(d) ? d : []));
    fetch('/api/attribute-values').then(r => r.json()).then((d) => setValues(Array.isArray(d) ? d : []));
  };
  useEffect(() => { load(); }, []);

  const createAttr = async () => {
    await fetch('/api/attributes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAttr) });
    setNewAttr({ code: '', name: '', category: 'general', displayType: 'select', variantCreation: 'no' });
    load();
  };
  const createVal = async () => {
    await fetch('/api/attribute-values', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newValue, attributeId: Number(newValue.attributeId), allowCustomValue: false }) });
    setNewValue({ attributeId: '', name: '', code: '', priceExtra: 0 });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Attributes</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Define attributes and their values used across services.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Create Attribute</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input placeholder="Code" value={newAttr.code} onChange={e => setNewAttr({ ...newAttr, code: e.target.value })} />
            <Input placeholder="Name" value={newAttr.name} onChange={e => setNewAttr({ ...newAttr, name: e.target.value })} />
            <Input placeholder="Category" value={newAttr.category} onChange={e => setNewAttr({ ...newAttr, category: e.target.value })} />
            <select className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600" value={newAttr.displayType} onChange={e => setNewAttr({ ...newAttr, displayType: e.target.value })}>
              <option value="select">select</option>
              <option value="color">color</option>
              <option value="radio">radio</option>
              <option value="checkbox">checkbox</option>
            </select>
          </div>
          <Button className="mt-3" onClick={createAttr}><Plus size={14} /> Add Attribute</Button>
        </Card>

        <Card>
          <CardHeader><CardTitle>Create Attribute Value</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600" value={newValue.attributeId} onChange={e => setNewValue({ ...newValue, attributeId: e.target.value })}>
              <option value="">Select attribute</option>
              {attrs.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <Input placeholder="Name" value={newValue.name} onChange={e => setNewValue({ ...newValue, name: e.target.value })} />
            <Input placeholder="Code" value={newValue.code} onChange={e => setNewValue({ ...newValue, code: e.target.value })} />
            <Input type="number" placeholder="Price extra" value={newValue.priceExtra} onChange={e => setNewValue({ ...newValue, priceExtra: Number(e.target.value) })} />
          </div>
          <Button className="mt-3" onClick={createVal}><Plus size={14} /> Add Value</Button>
        </Card>
      </div>

      {attrs.length === 0 ? (
        <EmptyState title="No attributes yet" description="Create attributes to configure services." icon={Layers} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {attrs.map((a: any) => (
            <Card key={a.id}>
              <CardHeader>
                <div className="min-w-0">
                  <CardTitle className="truncate">{a.name}</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{a.code} • {a.displayType} • {a.category}</p>
                </div>
                <Badge color={a.active ? 'emerald' : 'rose'}>{a.active ? 'Active' : 'Archived'}</Badge>
              </CardHeader>
              <div className="flex flex-wrap gap-2">
                {values.filter((v: any) => v.attributeId === a.id).map((v: any) => (
                  <Badge key={v.id} color="indigo">{v.name} {v.priceExtra ? `(+${v.priceExtra})` : ''}</Badge>
                ))}
                {values.filter((v: any) => v.attributeId === a.id).length === 0 && <p className="text-sm text-slate-500 dark:text-slate-500">No values.</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
