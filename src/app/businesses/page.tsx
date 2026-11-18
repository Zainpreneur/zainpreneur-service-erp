'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Field, FormSection, FormFooter, TextInput, Select, Checkbox, FormGrid } from '@/components/ui/Form';
import { ListView, ListItem } from '@/components/ui/ListView';
import { Building2, Plus, Trash2, Edit2, User, Building, Phone, Mail } from 'lucide-react';

type Business = any;

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [form, setForm] = useState({
    name: '', code: '', category: '', industry: '', city: '', country: '',
    contactName: '', contactRole: '', contactEmail: '', contactPhone: '',
    relationship: 'client', tier: '', healthScore: '', website: '',
    isCustomer: false, isPortfolio: false, notes: '',
  });
  const [show, setShow] = useState(false);
  const [contactsFor, setContactsFor] = useState<Business | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactForm, setContactForm] = useState({ name: '', role: '', email: '', phone: '', isPrimary: false });
  const [branchesFor, setBranchesFor] = useState<Business | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [branchForm, setBranchForm] = useState({ name: '', city: '', country: '' });
  const [editingBiz, setEditingBiz] = useState<string | null>(null);
  const [bizForm, setBizForm] = useState({ name: '', code: '', category: '', industry: '', city: '', country: '', contactName: '', contactRole: '', contactEmail: '', contactPhone: '', relationship: 'client', tier: '', healthScore: '', website: '', isCustomer: false, isPortfolio: false, notes: '' });

  const load = () => fetch('/api/businesses').then(r => r.json()).then((d) => setBusinesses(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const loadContacts = (b: Business) => { setContactsFor(b); fetch(`/api/business-contacts?businessId=${b.id}`).then(r => r.json()).then((d) => setContacts(Array.isArray(d) ? d : [])); };
  const loadBranches = (b: Business) => { setBranchesFor(b); fetch(`/api/business-branches?businessId=${b.id}`).then(r => r.json()).then((d) => setBranches(Array.isArray(d) ? d : [])); };

  const create = async () => {
    await fetch('/api/businesses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, healthScore: form.healthScore ? Number(form.healthScore) : null, social: { website: form.website } }) });
    setForm({ name: '', code: '', category: '', industry: '', city: '', country: '', contactName: '', contactRole: '', contactEmail: '', contactPhone: '', relationship: 'client', tier: '', healthScore: '', website: '', isCustomer: false, isPortfolio: false, notes: '' });
    setShow(false);
    load();
  };
  const updateBiz = async (id: string) => {
    await fetch(`/api/businesses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...bizForm, healthScore: bizForm.healthScore ? Number(bizForm.healthScore) : null }) });
    setEditingBiz(null);
    load();
  };

  const createContact = async () => {
    if (!contactsFor) return;
    await fetch('/api/business-contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessId: contactsFor.id, ...contactForm }) });
    setContactForm({ name: '', role: '', email: '', phone: '', isPrimary: false });
    loadContacts(contactsFor);
  };
  const deleteContact = async (id: number) => {
    await fetch(`/api/business-contacts/${id}`, { method: 'DELETE' });
    if (contactsFor) loadContacts(contactsFor);
  };

  const createBranch = async () => {
    if (!branchesFor) return;
    await fetch('/api/business-branches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessId: branchesFor.id, ...branchForm }) });
    setBranchForm({ name: '', city: '', country: '' });
    loadBranches(branchesFor);
  };
  const deleteBranch = async (id: number) => {
    await fetch('/api/business-branches', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (branchesFor) loadBranches(branchesFor);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Businesses"
        description="Customers and accounts."
        action={<Button onClick={() => setShow(true)}><Plus size={16} /> New Business</Button>}
      />

      {businesses.length === 0 ? (
        <EmptyState title="No businesses yet" description="Add your first customer account." icon={Building2} />
      ) : (
        <ListView
          items={businesses}
          renderItem = {(b) => (
            <ListItem
              key={b.id}
              leading={<div className="h-10 w-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Building size={20} /></div>}
              trailing={
                <div className="flex items-center gap-2">
                  <Badge color={b.status === 'active' ? 'success' : 'danger'}>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => { setBizForm({ name: b.name, code: b.code || '', category: b.category || '', industry: b.industry || '', city: b.city || '', country: b.country || '', contactName: b.contactName || '', contactRole: b.contactRole || '', contactEmail: b.contactEmail || '', contactPhone: b.contactPhone || '', relationship: b.relationship || 'client', tier: b.tier || '', healthScore: String(b.healthScore || ''), website: b.social?.website || '', isCustomer: !!b.isCustomer, isPortfolio: !!b.isPortfolio, notes: b.notes || '' }); setEditingBiz(b.id); setContactsFor(null); setBranchesFor(null); }}><Edit2 size={16} /></Button>
                  <Button variant="danger" size="sm" onClick={() => { if (window.confirm('Delete this business?')) { fetch(`/api/businesses/${b.id}`, { method: 'DELETE' }).then(() => load()); } }}><Trash2 size={16} /></Button>
                </div>
              }
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{b.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{b.reference} {b.code ? `• ${b.code}` : ''}</div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{b.industry || '—'}</div>
                <div className="text-slate-500 dark:text-slate-400">{b.city}{b.country ? `, ${b.country}` : ''}</div>
              </div>
            </ListItem>
          )}
          emptyTitle="No businesses yet"
          emptyDescription="Add your first customer account."
        />
      )}

      <Modal open={!!branchesFor} onOpenChange={(v) => { if (!v) setBranchesFor(null); }} title={`Branches — ${branchesFor?.name ?? ''}`} description="Manage business branches.">
        <div className="space-y-3">
          {branches.map((br: any) => (
            <div key={br.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-sm">
              <div>{br.name} · {br.city}{br.country ? `, ${br.country}` : ''}</div>
              <Button variant="danger" onClick={() => deleteBranch(br.id)}>Delete</Button>
            </div>
          ))}
          {branches.length === 0 && <p className="text-slate-500 dark:text-slate-500">No branches yet.</p>}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <TextInput id="branch-name" placeholder="Name" value={branchForm.name} onChange={e => setBranchForm({ ...branchForm, name: e.target.value })} />
            <TextInput id="branch-city" placeholder="City" value={branchForm.city} onChange={e => setBranchForm({ ...branchForm, city: e.target.value })} />
            <TextInput id="branch-country" placeholder="Country" value={branchForm.country} onChange={e => setBranchForm({ ...branchForm, country: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setBranchesFor(null)}>Close</Button>
            <Button onClick={createBranch}>Add Branch</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!contactsFor} onOpenChange={(v) => { if (!v) setContactsFor(null); }} title={`Contacts — ${contactsFor?.name ?? ''}`} description="Manage business contacts.">
        <div className="space-y-3">
          {contacts.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-sm">
              <div>
                <div className="font-medium">{c.name} {c.isPrimary ? '(primary)' : ''}</div>
                <div className="text-slate-500 dark:text-slate-500">{c.role} · {c.email} · {c.phone}</div>
              </div>
              <Button variant="danger" onClick={() => deleteContact(c.id)}>Delete</Button>
            </div>
          ))}
          {contacts.length === 0 && <p className="text-slate-500 dark:text-slate-500">No contacts yet.</p>}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="Name">
              <TextInput id="contact-name" placeholder="Name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
            </Field>
            <Field label="Role">
              <TextInput id="contact-role" placeholder="Role" value={contactForm.role} onChange={e => setContactForm({ ...contactForm, role: e.target.value })} />
            </Field>
            <Field label="Email">
              <TextInput id="contact-email" type="email" placeholder="Email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <TextInput id="contact-phone" type="tel" placeholder="Phone" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} />
            </Field>
          </div>
          <Field>
            <Checkbox checked={contactForm.isPrimary} onChange={v => setContactForm({ ...contactForm, isPrimary: v })} label="Primary contact" />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setContactsFor(null)}>Close</Button>
            <Button onClick={createContact}>Add Contact</Button>
          </div>
        </div>
      </Modal>

      <Modal open={show} onOpenChange={setShow} title="Create Business" description="Add a new customer account.">
        <div className="space-y-4">
          <FormSection title="Business details">
            <FormGrid cols={2}>
              <Field label="Name" required>
                <TextInput id="biz-name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Code">
                <TextInput id="biz-code" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
              </Field>
              <Field label="Category">
                <TextInput id="biz-category" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </Field>
              <Field label="Industry">
                <TextInput id="biz-industry" placeholder="Industry" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
              </Field>
              <Field label="City">
                <TextInput id="biz-city" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </Field>
              <Field label="Country">
                <TextInput id="biz-country" placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
              </Field>
            </FormGrid>
          </FormSection>

          <FormSection title="Contact">
            <FormGrid cols={2}>
              <Field label="Contact Name">
                <TextInput id="biz-contact-name" placeholder="Contact Name" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
              </Field>
              <Field label="Contact Role">
                <TextInput id="biz-contact-role" placeholder="Role" value={form.contactRole} onChange={e => setForm({ ...form, contactRole: e.target.value })} />
              </Field>
              <Field label="Contact Email" type="email">
                <TextInput id="biz-contact-email" type="email" placeholder="Email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
              </Field>
              <Field label="Contact Phone" type="tel">
                <TextInput id="biz-contact-phone" type="tel" placeholder="Phone" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} />
              </Field>
            </FormGrid>
          </FormSection>

          <FormSection title="Classification">
            <FormGrid cols={2}>
              <Field label="Relationship">
                <Select id="biz-relationship" value={form.relationship} onChange={value => setForm({ ...form, relationship: value })}>
                  <option value="client">Client</option>
                  <option value="equity">Equity</option>
                  <option value="owned">Owned</option>
                </Select>
              </Field>
              <Field label="Tier">
                <Select id="biz-tier" value={form.tier} onChange={value => setForm({ ...form, tier: value })}>
                  <option value="">None</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                  <option value="basic">Basic</option>
                </Select>
              </Field>
              <Field label="Health Score (0-100)">
                <TextInput id="biz-health-score" type="number" placeholder="0-100" value={form.healthScore} onChange={e => setForm({ ...form, healthScore: e.target.value })} />
              </Field>
              <Field label="Website">
                <TextInput id="biz-website" placeholder="Website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
              </Field>
            </FormGrid>
          </FormSection>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field>
              <Checkbox checked={form.isCustomer} onChange={v => setForm({ ...form, isCustomer: v })} label="Is Customer" />
            </Field>
            <Field>
              <Checkbox checked={form.isPortfolio} onChange={v => setForm({ ...form, isPortfolio: v })} label="Is Portfolio" />
            </Field>
          </div>
        </div>
        <FormFooter>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={create}>Create Business</Button>
        </FormFooter>
      </Modal>

      <Modal open={!!editingBiz} onOpenChange={(v) => { if (!v) setEditingBiz(null); }} title="Edit Business" description="Update business details.">
        <div className="space-y-4">
          <FormSection title="Business details">
            <FormGrid cols={2}>
              <Field label="Name" required>
                <TextInput id="edit-biz-name" placeholder="Name" value={bizForm.name} onChange={e => setBizForm({ ...bizForm, name: e.target.value })} />
              </Field>
              <Field label="Code">
                <TextInput id="edit-biz-code" placeholder="Code" value={bizForm.code} onChange={e => setBizForm({ ...bizForm, code: e.target.value })} />
              </Field>
              <Field label="Category">
                <TextInput id="edit-biz-category" placeholder="Category" value={bizForm.category} onChange={e => setBizForm({ ...bizForm, category: e.target.value })} />
              </Field>
              <Field label="Industry">
                <TextInput id="edit-biz-industry" placeholder="Industry" value={bizForm.industry} onChange={e => setBizForm({ ...bizForm, industry: e.target.value })} />
              </Field>
              <Field label="City">
                <TextInput id="edit-biz-city" placeholder="City" value={bizForm.city} onChange={e => setBizForm({ ...bizForm, city: e.target.value })} />
              </Field>
              <Field label="Country">
                <TextInput id="edit-biz-country" placeholder="Country" value={bizForm.country} onChange={e => setBizForm({ ...bizForm, country: e.target.value })} />
              </Field>
              <Field label="Contact Name">
                <TextInput id="edit-biz-contactName" placeholder="Contact Name" value={bizForm.contactName} onChange={e => setBizForm({ ...bizForm, contactName: e.target.value })} />
              </Field>
              <Field label="Contact Email" type="email">
                <TextInput id="edit-biz-contactEmail" type="email" placeholder="Email" value={bizForm.contactEmail} onChange={e => setBizForm({ ...bizForm, contactEmail: e.target.value })} />
              </Field>
              <Field label="Contact Phone" type="tel">
                <TextInput id="edit-biz-contactPhone" type="tel" placeholder="Phone" value={bizForm.contactPhone} onChange={e => setBizForm({ ...bizForm, contactPhone: e.target.value })} />
              </Field>
              <Field label="Tier">
                <Select id="edit-biz-tier" value={bizForm.tier} onChange={e => setBizForm({ ...bizForm, tier: e.target.value })}>
                  <option value="">None</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                  <option value="basic">Basic</option>
                </Select>
              </Field>
              <Field label="Health Score (0-100)">
                <TextInput id="edit-biz-healthScore" type="number" placeholder="0-100" value={bizForm.healthScore} onChange={e => setBizForm({ ...bizForm, healthScore: e.target.value })} />
              </Field>
            </FormGrid>
          </FormSection>
          <FormFooter>
            <Button variant="secondary" onClick={() => setEditingBiz(null)}>Cancel</Button>
            <Button onClick={() => updateBiz(editingBiz!)}>Save Changes</Button>
          </FormFooter>
        </div>
      </Modal>
    </div>
  );
}

