import { Head, Link, useForm } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Icons } from '@/Components/GymIcons';
import { FormEvent } from 'react';

type Plan = { id: number; name: string; price: number; cycle: string };
type Member = {
    id?: number; name?: string; email?: string; phone?: string; plan_id?: number | null;
    status?: string; joined_at?: string; visits_30d?: number; mrr?: number;
    emergency_contact?: string; access_method?: string;
};
type Props = { member: Member | null; plans: Plan[] };

const STATUSES = [
    { v: 'active',  l: 'Active' }, { v: 'trial',   l: 'Trial' },
    { v: 'frozen',  l: 'Frozen' }, { v: 'expired', l: 'Expired' },
];

export default function MemberForm({ member, plans }: Props) {
    const isEdit = !!member?.id;
    const form = useForm({
        name:              member?.name ?? '',
        email:             member?.email ?? '',
        phone:             member?.phone ?? '',
        plan_id:           (member?.plan_id ?? plans[0]?.id ?? null) as number | null,
        status:            member?.status ?? 'active',
        joined_at:         member?.joined_at ?? new Date().toISOString().slice(0, 10),
        visits_30d:        member?.visits_30d ?? 0,
        mrr:               member?.mrr ?? 0,
        emergency_contact: member?.emergency_contact ?? '',
        access_method:     member?.access_method ?? 'App QR',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) form.put(route('members.update', member!.id));
        else        form.post(route('members.store'));
    };

    const remove = () => {
        if (!isEdit) return;
        if (confirm(`Remove ${member?.name}? This can't be undone.`)) {
            form.delete(route('members.destroy', member!.id));
        }
    };

    return (
        <GymLayout active="members" crumb={isEdit ? 'Edit' : 'Add'} action={
            <>
                <Link href={route('members.index')} className="btn-ghost">Cancel</Link>
                {isEdit && <button type="button" className="btn-ghost" onClick={remove} style={{ color: 'var(--danger)' }}><Icons.Trash /> Delete</button>}
            </>
        }>
            <Head title={isEdit ? 'Edit member' : 'Add member'} />
            <div className="page">
                <div className="page-head">
                    <div className="row gap-3">
                        <Link href={route('members.index')} className="icon-btn"><Icons.Back /></Link>
                        <div>
                            <h1 className="page-title">{isEdit ? `Edit ${member?.name}` : 'Add a new member'}</h1>
                            <p className="page-sub">Member details, plan and access settings.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 760 }}>
                    <FormSection title="Profile">
                        <div className="field-row">
                            <Field label="Full name" error={form.errors.name}>
                                <input className="input" value={form.data.name} onChange={e => form.setData('name', e.target.value)} required />
                            </Field>
                            <Field label="Email" error={form.errors.email}>
                                <input type="email" className="input" value={form.data.email} onChange={e => form.setData('email', e.target.value)} required />
                            </Field>
                        </div>
                        <div className="field-row">
                            <Field label="Phone" error={form.errors.phone}>
                                <input className="input" value={form.data.phone} onChange={e => form.setData('phone', e.target.value)} placeholder="+971 50 ..." />
                            </Field>
                            <Field label="Emergency contact" error={form.errors.emergency_contact}>
                                <input className="input" value={form.data.emergency_contact} onChange={e => form.setData('emergency_contact', e.target.value)} />
                            </Field>
                        </div>
                    </FormSection>

                    <FormSection title="Membership">
                        <div className="field-row">
                            <Field label="Plan" error={form.errors.plan_id}>
                                <select className="input" value={String(form.data.plan_id ?? '')} onChange={e => form.setData('plan_id', e.target.value ? Number(e.target.value) : null)}>
                                    <option value="">— No plan —</option>
                                    {plans.map(p => <option key={p.id} value={p.id}>{p.name} · AED {p.price} {p.cycle}</option>)}
                                </select>
                            </Field>
                            <Field label="Status" error={form.errors.status}>
                                <select className="input" value={form.data.status} onChange={e => form.setData('status', e.target.value)}>
                                    {STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                                </select>
                            </Field>
                        </div>
                        <div className="field-row">
                            <Field label="Joined" error={form.errors.joined_at}>
                                <input type="date" className="input" value={form.data.joined_at} onChange={e => form.setData('joined_at', e.target.value)} required />
                            </Field>
                            <Field label="Monthly revenue (AED)" error={form.errors.mrr}>
                                <input type="number" min={0} step="0.01" className="input" value={form.data.mrr} onChange={e => form.setData('mrr', Number(e.target.value))} />
                            </Field>
                        </div>
                        <div className="field-row">
                            <Field label="Visits (30d)" error={form.errors.visits_30d}>
                                <input type="number" min={0} className="input" value={form.data.visits_30d} onChange={e => form.setData('visits_30d', Number(e.target.value))} />
                            </Field>
                            <Field label="Access method" error={form.errors.access_method}>
                                <select className="input" value={form.data.access_method} onChange={e => form.setData('access_method', e.target.value)}>
                                    <option>App QR</option>
                                    <option>Wristband</option>
                                    <option>Card</option>
                                    <option>Front desk</option>
                                </select>
                            </Field>
                        </div>
                    </FormSection>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--hairline)', paddingTop: 18 }}>
                        <Link href={route('members.index')} className="btn-ghost">Cancel</Link>
                        <button type="submit" className="btn-primary" disabled={form.processing}>
                            <Icons.Check /> {isEdit ? 'Save changes' : 'Create member'}
                        </button>
                    </div>
                </form>
            </div>
        </GymLayout>
    );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 className="card-title">{title}</h3>
            {children}
        </div>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="field">
            <label>{label}</label>
            {children}
            {error && <span style={{ color: 'var(--danger)', fontSize: 11.5 }}>{error}</span>}
        </div>
    );
}
