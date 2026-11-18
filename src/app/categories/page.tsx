'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput, Select } from '@/components/ui/Form';
import { ListView, ListItem } from '@/components/ui/ListView';
import { Layers, Plus, Trash2, Edit2 } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', code: '', sequence: '' });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => fetch('/api/categories').then(r => r.json()).then((d) => setCategories(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, sequence: form.sequence ? Number(form.sequence) : 0 }) });
    setForm({ name: '', code: '', sequence: '' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setEditing(null);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Categories"
        description="Organize services into categories."
        action={<Button onClick={() => setShow(true)}><Plus size={16} /> New Category</Button>}
      />

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create your first service category." icon={Layers} />
      ) : (
        <ListView
          items={categories}
          renderItem={(c) => (
            <ListItem
              key={c.id}
              leading={<div className="h-10 w-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Layers size={20} /></div>}
              trailing={
                <div className="flex items-center gap-2">
                  <Badge color="default">{c.sequence}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => { setForm({ name: c.name, code: c.code, sequence: String(c.sequence) }); setEditing(c.id); setShow(true); }}><Edit2 size={16} /></Button>
                  <Button variant="danger" size="sm" onClick={() => del(c.id)}><Trash2 size={16} /></Button>
                </div>
              }
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{c.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{c.code}</div>
              </div>
            </ListItem>
          )}
          emptyTitle="No categories yet"
          emptyDescription="Create your first service category."
        />
      )}

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Category' : 'Create Category'} description={editing ? 'Update category details.' : 'Add a new service category.'}>
        <div className="space-y-4">
          <FormSection>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Name" required>
                <TextInput id="cat-name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Code" required>
                <TextInput id="cat-code" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
              </Field>
              <Field label="Sequence">
                <TextInput id="cat-seq" type="number" placeholder="0" value={form.sequence} onChange={e => setForm({ ...form, sequence: e.target.value })} />
              </Field>
            </div>
          </FormSection>
          <FormFooter>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button onClick={editing ? () => update(editing!) : create}>{editing ? 'Save Changes' : 'Create Category'}</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}