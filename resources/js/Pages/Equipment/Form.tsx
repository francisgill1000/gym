import { Head, Link, useForm } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Icons } from '@/Components/GymIcons';
import { FormEvent } from 'react';

type Unit = {
    id?: number; name?: string; code?: string; zone?: string; category?: string;
    status?: string; last_serviced_at?: string | null; uses_lifetime?: number; notes?: string;
};

export default function EquipmentForm({ unit, statuses, categories }: { unit: Unit | null; statuses: string[]; categories: string[] }) {
    const isEdit = !!unit?.id;
    const form = useForm({
        name:             unit?.name ?? '',
        code:             unit?.code ?? '',
        zone:             unit?.zone ?? 'Floor A',
        category:         unit?.category ?? 'Strength',
        status:           unit?.status ?? 'operational',
        last_serviced_at: unit?.last_serviced_at ?? new Date().toISOString().slice(0, 10),
        uses_lifetime:    unit?.uses_lifetime ?? 0,
        notes:            unit?.notes ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) form.put(route('equipment.update', unit!.id));
        else        form.post(route('equipment.store'));
    };
    const remove = () => {
        if (!isEdit) return;
        if (confirm(`Remove ${unit?.name}?`)) form.delete(route('equipment.destroy', unit!.id));
    };

    return (
        <GymLayout active="equipment" crumb={isEdit ? 'Edit' : 'New unit'} action={
            <>
                <Link href={route('equipment.index')} className="btn-ghost">Cancel</Link>
                {isEdit && <button type="button" className="btn-ghost" onClick={remove} style={{ color: 'var(--danger)' }}><Icons.Trash /> Delete</button>}
            </>
        }>
            <Head title={isEdit ? 'Edit equipment' : 'Add equipment'} />
            <div className="page">
                <div className="page-head">
                    <div className="row gap-3">
                        <Link href={route('equipment.index')} className="icon-btn"><Icons.Back /></Link>
                        <div>
                            <h1 className="page-title">{isEdit ? `Edit ${unit?.name}` : 'Add equipment'}</h1>
                            <p className="page-sub">Track usage and maintenance status.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
                    <div className="field-row">
                        <div className="field"><label>Name</label><input className="input" value={form.data.name} onChange={e => form.setData('name', e.target.value)} required />{form.errors.name && <Err msg={form.errors.name} />}</div>
                        <div className="field"><label>Asset code</label><input className="input" value={form.data.code} onChange={e => form.setData('code', e.target.value.toUpperCase())} required />{form.errors.code && <Err msg={form.errors.code} />}</div>
                    </div>

                    <div className="field-row">
                        <div className="field"><label>Zone</label><input className="input" value={form.data.zone} onChange={e => form.setData('zone', e.target.value)} placeholder="Floor A, Spin, Ring…" /></div>
                        <div className="field">
                            <label>Category</label>
                            <select className="input" value={form.data.category} onChange={e => form.setData('category', e.target.value)}>
                                {categories.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label>Status</label>
                            <div className="seg">
                                {statuses.map(s => (
                                    <button type="button" key={s} className={form.data.status === s ? 'on' : ''} onClick={() => form.setData('status', s)} style={{ textTransform: 'capitalize' }}>{s.replace('-', ' ')}</button>
                                ))}
                            </div>
                        </div>
                        <div className="field"><label>Last serviced</label><input type="date" className="input" value={form.data.last_serviced_at ?? ''} onChange={e => form.setData('last_serviced_at', e.target.value)} /></div>
                    </div>

                    <div className="field"><label>Lifetime uses</label><input type="number" min={0} className="input" value={form.data.uses_lifetime} onChange={e => form.setData('uses_lifetime', Number(e.target.value))} /></div>
                    <div className="field"><label>Notes</label><textarea className="input" rows={3} value={form.data.notes} onChange={e => form.setData('notes', e.target.value)} /></div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--hairline)', paddingTop: 18 }}>
                        <Link href={route('equipment.index')} className="btn-ghost">Cancel</Link>
                        <button type="submit" className="btn-primary" disabled={form.processing}><Icons.Check /> {isEdit ? 'Save changes' : 'Add unit'}</button>
                    </div>
                </form>
            </div>
        </GymLayout>
    );
}

function Err({ msg }: { msg: string }) { return <span style={{ color: 'var(--danger)', fontSize: 11.5 }}>{msg}</span>; }
