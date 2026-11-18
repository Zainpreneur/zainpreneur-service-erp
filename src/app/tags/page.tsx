'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput } from '@/components/ui/Form';
import { ListView, ListItem } from '@/components/ui/ListView';
import { Tag as TagIcon, Plus, Trash2, Edit2 } from 'lucide-react';

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '' });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => fetch('/api/tags').then(r => r.json()).then((d) => setTags(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch('/api/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '' });
    setShow(false);
    load();
  };
  const update = async (id: string) => {
    await fetch(`/api/tags/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setEditing(null);
    load();
  };
  const del = async (id: string) => {
    if (!window.confirm('Archive this tag?')) return;
    await fetch(`/api/tags/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tags"
        description="Tag services, requests, tickets, businesses and people."
        action={<Button onClick={() => setShow(true)}><Plus size={16} /> New Tag</Button>}
      />

      {tags.length === 0 ? (
        <EmptyState title="No tags yet" description="Create tags to classify your records." icon={TagIcon} />
      ) : (
        <ListView
          items={tags}
          renderItem={(t) => (
            <ListItem
              key={t.id}
              leading={<div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"><TagIcon size={20} /></div>}
              trailing={
                <div className="flex items-center gap-2">
                  <Badge color="indigo">{t.name}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => { setForm({ name: t.name }); setEditing(t.id); setShow(true); }}><Edit2 size={16} /></Button>
                  <Button variant="danger" size="sm" onClick={() => del(t.id)}><Trash2 size={16} /></Button>
                </div>
              }
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{t.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.slug}</div>
              </div>
            </ListItem>
          )}
          emptyTitle="No tags yet"
          emptyDescription="Create tags to classify your records."
        />
      )}

      <Modal open={show} onOpenChange={setShow} title={editing ? 'Edit Tag' : 'Create Tag'} description={editing ? 'Update tag name.' : 'Add a new tag.'}>
        <div className="space-y-4">
          <FormSection>
            <Field label="Name" required>
              <TextInput id="tag-name" placeholder="Tag name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Field>
          </FormSection>
          <FormFooter>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button onClick={editing ? () => update(editing!) : create}>{editing ? 'Save Changes' : 'Create Tag'}</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}