import { Head, Link, useForm } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Icons } from '@/Components/GymIcons';
import { FormEvent } from 'react';

type Payment = {
    id?: number; member_id?: number | null; member_name?: string;
    item?: string; amount?: number; method?: string; status?: string; issued_at?: string;
};

export default function BillingForm({ payment, members, statuses }: { payment: Payment | null; members: { id: number; name: string }[]; statuses: string[] }) {
    const isEdit = !!payment?.id;
    const form = useForm({
        member_id:   payment?.member_id ?? null,
        member_name: payment?.member_name ?? '',
        item:        payment?.item ?? '',
        amount:      payment?.amount ?? 0,
        method:      payment?.method ?? 'Card',
        status:      payment?.status ?? 'paid',
        issued_at:   payment?.issued_at ?? new Date().toISOString().slice(0, 10),
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) form.put(route('billing.update', payment!.id));
        else        form.post(route('billing.store'));
    };
    const remove = () => {
        if (!isEdit) return;
        if (confirm('Delete this invoice?')) form.delete(route('billing.destroy', payment!.id));
    };

    return (
        <GymLayout active="billing" crumb={isEdit ? 'Edit' : 'New invoice'} action={
            <>
                <Link href={route('billing.index')} className="btn-ghost">Cancel</Link>
                {isEdit && <button type="button" className="btn-ghost" onClick={remove} style={{ color: 'var(--danger)' }}><Icons.Trash /> Delete</button>}
            </>
        }>
            <Head title={isEdit ? 'Edit invoice' : 'New invoice'} />
            <div className="page">
                <div className="page-head">
                    <div className="row gap-3">
                        <Link href={route('billing.index')} className="icon-btn"><Icons.Back /></Link>
                        <div>
                            <h1 className="page-title">{isEdit ? 'Edit invoice' : 'New invoice'}</h1>
                            <p className="page-sub">Record a payment, refund, or pending charge.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
                    <div className="field-row">
                        <div className="field">
                            <label>Member</label>
                            <select className="input" value={String(form.data.member_id ?? '')} onChange={e => form.setData('member_id', e.target.value ? Number(e.target.value) : null)}>
                                <option value="">— Walk-in / other —</option>
                                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label>Member name (if walk-in)</label>
                            <input className="input" value={form.data.member_name} onChange={e => form.setData('member_name', e.target.value)} placeholder="Walk-in" />
                        </div>
                    </div>

                    <div className="field">
                        <label>Item</label>
                        <input className="input" value={form.data.item} onChange={e => form.setData('item', e.target.value)} placeholder="Monthly Unlimited, PT pack…" required />
                    </div>

                    <div className="field-row">
                        <div className="field"><label>Amount (AED)</label><input type="number" min={0} step="0.01" className="input" value={form.data.amount} onChange={e => form.setData('amount', Number(e.target.value))} required /></div>
                        <div className="field"><label>Method</label><input className="input" value={form.data.method} onChange={e => form.setData('method', e.target.value)} placeholder="Card · 4242" /></div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label>Status</label>
                            <div className="seg">
                                {statuses.map(s => (
                                    <button type="button" key={s} className={form.data.status === s ? 'on' : ''} onClick={() => form.setData('status', s)} style={{ textTransform: 'capitalize' }}>{s}</button>
                                ))}
                            </div>
                        </div>
                        <div className="field"><label>Date</label><input type="date" className="input" value={form.data.issued_at} onChange={e => form.setData('issued_at', e.target.value)} required /></div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--hairline)', paddingTop: 18 }}>
                        <Link href={route('billing.index')} className="btn-ghost">Cancel</Link>
                        <button type="submit" className="btn-primary" disabled={form.processing}><Icons.Check /> {isEdit ? 'Save changes' : 'Create invoice'}</button>
                    </div>
                </form>
            </div>
        </GymLayout>
    );
}
