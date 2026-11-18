'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput, Select, FormGrid } from '@/components/ui/Form';
import { ListView, ListItem } from '@/components/ui/ListView';
import { Layers, Plus, Trash2, Edit2, Key } from 'lucide-react';

export default function AttributesPage() {
  const [attrs, setAttrs] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const [form, setForm] = useState({ code: '', name: '', category: 'general', displayType: 'select', variantCreation: 'no' });
  const [newValue, setNewValue] = useState({ attributeId: '', name: '', code: '', priceExtra: 0 });
  const [showAttr, setShowAttr] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const [editingAttr, setEditingAttr] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string | null>(null);

  const load = () => {
    fetch('/api/attributes').then(r => r.json()).then((d) => setAttrs(Array.isArray(d) ? d : []));
    fetch('/api/attribute-values').then(r => r.json()).then((d) => setValues(Array.isArray(d) ? d : []));
  };
  useEffect(() => { load(); }, []);

  const createAttr = async () => {
    await fetch('/api/attributes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ code: '', name: '', category: 'general', displayType: 'select', variantCreation: 'no' });
    setShowAttr(false);
    load();
  };
  const updateAttr = async (id: string) => {
    await fetch(`/api/attributes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setEditingAttr(null);
    setShowAttr(false);
    load();
  };
  const delAttr = async (id: string) => {
    if (!window.confirm('Delete this attribute?')) return;
    await fetch(`/api/attributes/${id}`, { method: 'DELETE' });
    load();
  };
  const createVal = async () => {
    await fetch('/api/attribute-values', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newValue, attributeId: Number(newValue.attributeId), allowCustomValue: false }) });
    setNewValue({ attributeId: '', name: '', code: '', priceExtra: 0 });
    setShowValue(false);
    load();
  };
  const updateVal = async (id: string) => {
    await fetch(`/api/attribute-values/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newValue) });
    setEditingValue(null);
    setShowValue(false);
    load();
  };
  const delVal = async (id: string) => {
    if (!window.confirm('Delete this value?')) return;
    await fetch(`/api/attribute-values/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attributes"
        description="Define attributes and their values used across services."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Modal open={showAttr} onOpenChange={setShowAttr} title={editingAttr ? 'Edit Attribute' : 'Create Attribute'} description={editingAttr ? 'Update attribute details.' : 'Define a new attribute.'}>
          <div className="space-y-4">
            <FormSection>
              <FormGrid cols={2}>
                <Field label="Code" required>
                  <TextInput id="attr-code" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
                </Field>
                <Field label="Name" required>
                  <TextInput id="attr-name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Category">
                  <TextInput id="attr-category" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                </Field>
                <Field label="Display Type">
                  <Select id="attr-displayType" value={form.displayType} onChange={value => setForm({ ...form, displayType: value })}>
                    <option value="select">Select</option>
                    <option value="color">Color</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                  </Select>
                </Field>
                <Field label="Variant Creation">
                  <Select id="attr-variantCreation" value={form.variantCreation} onChange={value => setForm({ ...form, variantCreation: value })}>
                    <option value="instantly">Instantly</option>
                    <option value="dynamically">Dynamically</option>
                    <option value="never">Never</option>
                  </Select>
                </Field>
              </FormGrid>
            </FormSection>
            <FormFooter>
              <Button variant="secondary" onClick={() => setShowAttr(false)}>Cancel</Button>
              <Button onClick={editingAttr ? () => updateAttr(editingAttr!) : createAttr}>{editingAttr ? 'Save Changes' : 'Create Attribute'}</Button>
            </FormFooter>
          </div>
        </Modal>

        <Modal open={showValue} onOpenChange={setShowValue} title={editingValue ? 'Edit Attribute Value' : 'Create Attribute Value'} description={editingValue ? 'Update value details.' : 'Add a value to an attribute.'}>
          <div className="space-y-4">
            <FormSection>
              <FormGrid cols={2}>
                <Field label="Attribute" required>
                  <Select id="val-attribute" value={newValue.attributeId} onChange={e => setNewValue({ ...newValue, attributeId: e.target.value })}>
                    <option value="">Select attribute</option>
                    {attrs.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </Select>
                </Field>
                <Field label="Name" required>
                  <TextInput id="val-name" placeholder="Name" value={newValue.name} onChange={e => setNewValue({ ...newValue, name: e.target.value })} />
                </Field>
                <Field label="Code">
                  <TextInput id="val-code" placeholder="Code" value={newValue.code} onChange={e => setNewValue({ ...newValue, code: e.target.value })} />
                </Field>
                <Field label="Price Extra">
                  <TextInput id="val-price" type="number" placeholder="0" value={String(newValue.priceExtra)} onChange={e => setNewValue({ ...newValue, priceExtra: Number(e.target.value) })} />
                </Field>
              </FormGrid>
            </FormSection>
            <FormFooter>
              <Button variant="secondary" onClick={() => setShowValue(false)}>Cancel</Button>
              <Button onClick={editingValue ? () => updateVal(editingValue!) : createVal}>{editingValue ? 'Save Changes' : 'Create Value'}</Button>
            </FormFooter>
          </div>
        </Modal>
      </div>

      {attrs.length === 0 ? (
        <EmptyState title="No attributes yet" description="Create attributes to configure services." icon={Layers} />
      ) : (
        <ListView
          items={attrs}
          renderItem={(a) => (
            <ListItem
              key={a.id}
              leading={<div className="h-10 w-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Layers size={20} /></div>}
              trailing={
                <div className="flex items-center gap-2">
                  <Badge color={a.active ? 'success' : 'danger'}>{a.active ? 'Active' : 'Archived'}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => { setForm({ code: a.code, name: a.name, category: a.category, displayType: a.displayType, variantCreation: a.variantCreation }); setEditingAttr(a.id); setShowAttr(true); }}><Edit2 size={16} /></Button>
                  <Button variant="danger" size="sm" onClick={() => delAttr(a.id)}><Trash2 size={16} /></Button>
                </div>
              }
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{a.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{a.code} • {a.displayType} • {a.category}</div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {values.filter((v: any) => v.attributeId === a.id).slice(0, 3).map((v: any) => (
                  <Badge key={v.id} color="indigo" className="px-2">{v.name}</Badge>
                ))}
                {values.filter((v: any) => v.attributeId === a.id).length > 3 && <span className="text-slate-400">+{values.filter((v: any) => v.attributeId === a.id).length - 3}</span>}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => { setNewValue({ attributeId: String(a.id), name: '', code: '', priceExtra: 0 }); setShowValue(true); }}><Plus size={14} /> Add Value</Button>
              </div>
            </ListItem>
          )}
          emptyTitle="No attributes yet"
          emptyDescription="Create attributes to configure services."
        />
      )}

      <Modal open={showValue && editingValue} onOpenChange={(v) => { if (!v) setEditingValue(null); }} title="Edit Attribute Value">
        <div className="space-y-4">
          <FormSection>
            <FormGrid cols={2}>
              <Field label="Name" required>
                <TextInput id="edit-val-name" placeholder="Name" value={newValue.name} onChange={e => setNewValue({ ...newValue, name: e.target.value })} />
              </Field>
              <Field label="Code">
                <TextInput id="edit-val-code" placeholder="Code" value={newValue.code} onChange={e => setNewValue({ ...newValue, code: e.target.value })} />
              </Field>
              <Field label="Price Extra">
                <TextInput id="edit-val-price" type="number" placeholder="0" value={String(newValue.priceExtra)} onChange={e => setNewValue({ ...newValue, priceExtra: Number(e.target.value) })} />
              </Field>
            </FormGrid>
          </FormSection>
          <FormFooter>
            <Button variant="secondary" onClick={() => { setEditingValue(null); setShowValue(false); }}>Cancel</Button>
            <Button onClick={() => updateVal(editingValue!)}>Save Changes</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}