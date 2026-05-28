import { Head, Link, useForm } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Icons } from '@/Components/GymIcons';
import { FormEvent } from 'react';

type Plan = {
    id?: number; name?: string; code?: string; color?: string; price?: number;
    cycle?: string; description?: string | null; features?: string[]; status?: string;
};

const COLORS = ['#00ffcc', '#6aa9ff', '#f0b65a', '#a48cff', '#ff8aa3', '#8a938f'];
const CYCLES = ['per month', 'per year', 'per visit', 'per session', '10 credits'];

export default function PlanForm({ plan }: { plan: Plan | null }) {
    const isEdit = !!plan?.id;
    const form = useForm({
        name:        plan?.name ?? '',
        code:        plan?.code ?? '',
        color:       plan?.color ?? '#00ffcc',
        price:       plan?.price ?? 0,
        cycle:       plan?.cycle ?? 'per month',
        description: plan?.description ?? '',
        features:    plan?.features?.length ? [...plan.features, ''] : [''],
        status:      plan?.status ?? 'live',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const cleaned = (form.data.features || []).filter(f => f.trim() !== '');
        form.transform(d => ({ ...d, features: cleaned }));
        if (isEdit) form.put(route('plans.update', plan!.id));
        else        form.post(route('plans.store'));
    };

    const setFeat = (i: number, v: string) => {
        const next = [...form.data.features];
        next[i] = v;
        if (i === next.length - 1 && v.trim() !== '') next.push('');
        form.setData('features', next);
    };
    const rmFeat = (i: number) => form.setData('features', form.data.features.filter((_, idx) => idx !== i));

    const remove = () => {
        if (!isEdit) return;
        if (confirm(`Delete ${plan?.name}?`)) form.delete(route('plans.destroy', plan!.id));
    };

    return (
        <GymLayout active="plans" crumb={isEdit ? 'Edit' : 'New plan'} action={
            <>
                <Link href={route('plans.index')} className="btn-ghost">Cancel</Link>
                {isEdit && <button type="button" className="btn-ghost" onClick={remove} style={{ color: 'var(--danger)' }}><Icons.Trash /> Delete</button>}
            </>
        }>
            <Head title={isEdit ? 'Edit plan' : 'New plan'} />
            <div className="page">
                <div className="page-head">
                    <div className="row gap-3">
                        <Link href={route('plans.index')} className="icon-btn"><Icons.Back /></Link>
                        <div>
                            <h1 className="page-title">{isEdit ? `Edit ${plan?.name}` : 'New membership plan'}</h1>
                            <p className="page-sub">Pricing, features, and how it appears to members.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 760 }}>
                    <div className="field-row">
                        <div className="field">
                            <label>Name</label>
                            <input className="input" value={form.data.name} onChange={e => form.setData('name', e.target.value)} required />
                            {form.errors.name && <span style={{ color: 'var(--danger)', fontSize: 11.5 }}>{form.errors.name}</span>}
                        </div>
                        <div className="field">
                            <label>Code (2–8 chars)</label>
                            <input className="input" value={form.data.code} maxLength={8} onChange={e => form.setData('code', e.target.value.toUpperCase())} required />
                            {form.errors.code && <span style={{ color: 'var(--danger)', fontSize: 11.5 }}>{form.errors.code}</span>}
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label>Price (AED)</label>
                            <input type="number" min={0} step="0.01" className="input" value={form.data.price} onChange={e => form.setData('price', Number(e.target.value))} required />
                            {form.errors.price && <span style={{ color: 'var(--danger)', fontSize: 11.5 }}>{form.errors.price}</span>}
                        </div>
                        <div className="field">
                            <label>Billing cycle</label>
                            <select className="input" value={form.data.cycle} onChange={e => form.setData('cycle', e.target.value)}>
                                {CYCLES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label>Description</label>
                        <textarea className="input" rows={3} value={form.data.description ?? ''} onChange={e => form.setData('description', e.target.value)} />
                    </div>

                    <div className="field">
                        <label>Accent color</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {COLORS.map(c => (
                                <button type="button" key={c} onClick={() => form.setData('color', c)}
                                    style={{ width: 28, height: 28, borderRadius: 8, background: c, boxShadow: form.data.color === c ? '0 0 0 2px var(--canvas), 0 0 0 4px var(--accent)' : 'inset 0 0 0 1px rgba(255,255,255,0.15)' }} />
                            ))}
                            <input type="color" className="input" style={{ width: 60, padding: 2 }} value={form.data.color} onChange={e => form.setData('color', e.target.value)} />
                        </div>
                    </div>

                    <div className="field">
                        <label>Features (one per line — empty rows ignored)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {form.data.features.map((f, i) => (
                                <div key={i} style={{ display: 'flex', gap: 6 }}>
                                    <input className="input" style={{ flex: 1 }} value={f} onChange={e => setFeat(i, e.target.value)} placeholder="e.g. Unlimited classes" />
                                    {form.data.features.length > 1 && (
                                        <button type="button" className="icon-btn" onClick={() => rmFeat(i)} title="Remove"><Icons.Trash /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="field">
                        <label>Status</label>
                        <div className="seg">
                            {['live', 'popular', 'draft'].map(s => (
                                <button type="button" key={s} className={form.data.status === s ? 'on' : ''} onClick={() => form.setData('status', s)} style={{ textTransform: 'capitalize' }}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--hairline)', paddingTop: 18 }}>
                        <Link href={route('plans.index')} className="btn-ghost">Cancel</Link>
                        <button type="submit" className="btn-primary" disabled={form.processing}><Icons.Check /> {isEdit ? 'Save changes' : 'Create plan'}</button>
                    </div>
                </form>
            </div>
        </GymLayout>
    );
}
