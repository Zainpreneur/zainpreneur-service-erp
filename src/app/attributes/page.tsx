'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Layers, Plus } from 'lucide-react';

export default function AttributesPage() {
  const [attrs, setAttrs] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const [newAttr, setNewAttr] = useState({ code: '', name: '', category: 'general', displayType: 'select', variantCreation: 'no' });
  const [newValue, setNewValue] = useState({ attributeId: '', name: '', code: '', priceExtra: 0 });

  const load = () => {
    fetch('/api/attributes').then(r => r.json()).then(setAttrs);
    fetch('/api/attribute-values').then(r => r.json()).then(setValues);
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
        <h1 className="text-3xl font-bold">Attributes</h1>
        <p className="mt-1 text-slate-400">Define attributes and their values used across services.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Create Attribute</CardTitle></CardHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <Input placeholder="Code" value={newAttr.code} onChange={e => setNewAttr({ ...newAttr, code: e.target.value })} />
          <Input placeholder="Name" value={newAttr.name} onChange={e => setNewAttr({ ...newAttr, name: e.target.value })} />
          <Input placeholder="Category" value={newAttr.category} onChange={e => setNewAttr({ ...newAttr, category: e.target.value })} />
          <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" value={newAttr.displayType} onChange={e => setNewAttr({ ...newAttr, displayType: e.target.value })}>
            <option value="select">select</option><option value="color">color</option><option value="radio">radio</option><option value="checkbox">checkbox</option>
          </select>
          <Button onClick={createAttr}><Plus size={14} /> Add</Button>
        </div>
      </Card>
      <Card>
        <CardHeader><CardTitle>Create Attribute Value</CardTitle></CardHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm" value={newValue.attributeId} onChange={e => setNewValue({ ...newValue, attributeId: e.target.value })}>
            <option value="">Select attribute</option>
            {attrs.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <Input placeholder="Name" value={newValue.name} onChange={e => setNewValue({ ...newValue, name: e.target.value })} />
          <Input placeholder="Code" value={newValue.code} onChange={e => setNewValue({ ...newValue, code: e.target.value })} />
          <Input type="number" placeholder="Price extra" value={newValue.priceExtra} onChange={e => setNewValue({ ...newValue, priceExtra: Number(e.target.value) })} />
          <Button onClick={createVal}><Plus size={14} /> Add</Button>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {attrs.map((a: any) => (
          <Card key={a.id}>
            <CardHeader>
              <div>
                <CardTitle>{a.name}</CardTitle>
                <p className="text-xs text-slate-500">{a.code} · {a.displayType} · {a.category}</p>
              </div>
              <Badge color={a.active ? 'emerald' : 'rose'}>{a.active ? 'Active' : 'Archived'}</Badge>
            </CardHeader>
            <div className="flex flex-wrap gap-2">
              {values.filter((v: any) => v.attributeId === a.id).map((v: any) => (
                <Badge key={v.id} color="indigo">{v.name} {v.priceExtra ? `(+${v.priceExtra})` : ''}</Badge>
              ))}
              {values.filter((v: any) => v.attributeId === a.id).length === 0 && <p className="text-sm text-slate-500">No values.</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}