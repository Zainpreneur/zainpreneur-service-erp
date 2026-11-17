'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [service, setService] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [attrs, setAttrs] = useState<any[]>([]);
  const [svcAttrs, setSvcAttrs] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [support, setSupport] = useState<any>(null);

  const load = () => {
    fetch(`/api/services/${id}`).then(r => r.json()).then(setService);
    fetch(`/api/variants?serviceId=${id}`).then(r => r.json()).then(setVariants);
    fetch('/api/attributes').then(r => r.json()).then(setAttrs);
    fetch(`/api/service-attributes?serviceId=${id}`).then(r => r.json()).then(setSvcAttrs);
    fetch(`/api/config-rules?serviceId=${id}`).then(r => r.json()).then(setRules);
    fetch(`/api/support-info?serviceId=${id}`).then(r => r.json()).then(setSupport);
  };
  useEffect(() => { load(); }, [id]);

  if (!service) return <p className="text-slate-400">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/services" className="text-slate-400 hover:text-slate-100"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold">{service.name}</h1>
          <p className="text-sm text-slate-400">{service.code} · {service.categoryName} · {service.currency} {service.basePrice}</p>
        </div>
        <Badge color={service.active ? 'emerald' : 'rose'} className="ml-auto">{service.active ? 'Active' : 'Archived'}</Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="variants">Variants ({variants.length})</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <p className="text-slate-300">{service.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Type:</span> {service.serviceType}</div>
              <div><span className="text-slate-500">Team:</span> {service.team}</div>
              <div><span className="text-slate-500">Delivery:</span> {service.deliveryDays} days</div>
              <div><span className="text-slate-500">Base cost:</span> {service.currency} {service.baseCost}</div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="variants">
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <Button><Plus size={14} /> Add Variant</Button>
            </CardHeader>
            <div className="space-y-3">
              {variants.map((v: any) => (
                <div key={v.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{v.name}</p>
                      <p className="text-xs text-slate-500">{v.code}</p>
                    </div>
                    <div className="text-sm font-semibold">{v.currency} {v.price}</div>
                  </div>
                  {v.values?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {v.values.map((val: any, i: number) => {
                        const a = attrs.find((x: any) => x.id === val.attributeId);
                        const av = a ? null : null;
                        return <Badge key={i} color="indigo">{a?.name}: {val.attributeValueId}</Badge>;
                      })}
                    </div>
                  ) : null}
                </div>
              ))}
              {variants.length === 0 && <p className="text-slate-500">No variants yet.</p>}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attributes">
          <Card>
            <CardHeader><CardTitle>Service Attributes</CardTitle></CardHeader>
            <div className="space-y-2">
              {svcAttrs.map((sa: any) => {
                const a = attrs.find((x: any) => x.id === sa.attributeId);
                return (
                  <div key={sa.attributeId} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <div>
                      <p className="font-medium">{a?.name ?? sa.attributeId}</p>
                      <p className="text-xs text-slate-500">{a?.displayType} · {a?.category}</p>
                    </div>
                    <div className="flex gap-2">
                      {sa.required ? <Badge color="rose">Required</Badge> : null}
                      {sa.variantCreating ? <Badge color="cyan">Variant-creating</Badge> : null}
                    </div>
                  </div>
                );
              })}
              {svcAttrs.length === 0 && <p className="text-slate-500">No attributes linked.</p>}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader><CardTitle>Configuration Rules</CardTitle></CardHeader>
            <div className="space-y-2">
              {rules.map((r: any) => (
                <div key={r.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                  <p className="font-medium">{r.name} <span className="text-xs text-slate-500">({r.fieldType})</span></p>
                  {r.options?.length ? <p className="text-xs text-slate-500">Options: {r.options.join(', ')}</p> : null}
                  {r.isRequired ? <Badge color="rose" className="mt-1">Required</Badge> : null}
                </div>
              ))}
              {rules.length === 0 && <p className="text-slate-500">No configuration rules.</p>}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader><CardTitle>Support Info</CardTitle></CardHeader>
            {support ? (
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div><span className="text-slate-500">Email:</span> {support.supportEmail}</div>
                <div><span className="text-slate-500">Phone:</span> {support.supportPhone}</div>
                <div><span className="text-slate-500">Hours:</span> {support.supportHours}</div>
                <div><span className="text-slate-500">SLA:</span> {support.slaResponseTime}</div>
              </div>
            ) : <p className="text-slate-500">No support info.</p>}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}