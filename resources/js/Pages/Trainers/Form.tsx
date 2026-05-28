import { Head, Link, useForm } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Icons } from '@/Components/GymIcons';
import { FormEvent } from 'react';

type Trainer = {
    id?: number; name?: string; role?: string; specialty?: string; color?: string;
    clients?: number; classes_wk?: number; rating?: number; status?: string;
    email?: string; phone?: string;
};

const COLORS = ['#00ffcc', '#6aa9ff', '#f0b65a', '#a48cff', '#ff8aa3', '#34e6a4'];

export default function TrainerForm({ trainer }: { trainer: Trainer | null }) {
    const isEdit = !!trainer?.id;
    const form = useForm({
        name:       trainer?.name ?? '',
        role:       trainer?.role ?? 'Trainer',
        specialty:  trainer?.specialty ?? '',
        color:      trainer?.color ?? '#00ffcc',
        clients:    trainer?.clients ?? 0,
        classes_wk: trainer?.classes_wk ?? 0,
        rating:     trainer?.rating ?? 4.5,
        status:     trainer?.status ?? 'on-shift',
        email:      trainer?.email ?? '',
        phone:      trainer?.phone ?? '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) form.put(route('trainers.update', trainer!.id));
        else        form.post(route('trainers.store'));
    };

    const remove = () => {
        if (!isEdit) return;
        if (confirm(`Remove ${trainer?.name}?`)) form.delete(route('trainers.destroy', trainer!.id));
    };

    return (
        <GymLayout active="trainers" crumb={isEdit ? 'Edit' : 'New'} action={
            <>
                <Link href={route('trainers.index')} className="btn-ghost">Cancel</Link>
                {isEdit && <button type="button" className="btn-ghost" onClick={remove} style={{ color: 'var(--danger)' }}><Icons.Trash /> Delete</button>}
            </>
        }>
            <Head title={isEdit ? 'Edit trainer' : 'Add trainer'} />
            <div className="page">
                <div className="page-head">
                    <div className="row gap-3">
                        <Link href={route('trainers.index')} className="icon-btn"><Icons.Back /></Link>
                        <div>
                            <h1 className="page-title">{isEdit ? `Edit ${trainer?.name}` : 'Add a trainer'}</h1>
                            <p className="page-sub">Profile, specialty and shift status.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
                    <div className="field-row">
                        <div className="field"><label>Full name</label><input className="input" value={form.data.name} onChange={e => form.setData('name', e.target.value)} required />{form.errors.name && <Err msg={form.errors.name} />}</div>
                        <div className="field"><label>Role</label><input className="input" value={form.data.role} onChange={e => form.setData('role', e.target.value)} placeholder="Head Coach, Trainer, …" required /></div>
                    </div>
                    <div className="field"><label>Specialty</label><input className="input" value={form.data.specialty} onChange={e => form.setData('specialty', e.target.value)} placeholder="Strength & Conditioning" /></div>

                    <div className="field-row">
                        <div className="field"><label>Email</label><input type="email" className="input" value={form.data.email} onChange={e => form.setData('email', e.target.value)} /></div>
                        <div className="field"><label>Phone</label><input className="input" value={form.data.phone} onChange={e => form.setData('phone', e.target.value)} /></div>
                    </div>

                    <div className="field-row">
                        <div className="field"><label>Clients</label><input type="number" min={0} className="input" value={form.data.clients} onChange={e => form.setData('clients', Number(e.target.value))} /></div>
                        <div className="field"><label>Classes / week</label><input type="number" min={0} className="input" value={form.data.classes_wk} onChange={e => form.setData('classes_wk', Number(e.target.value))} /></div>
                        <div className="field"><label>Rating</label><input type="number" min={0} max={5} step="0.1" className="input" value={form.data.rating} onChange={e => form.setData('rating', Number(e.target.value))} /></div>
                    </div>

                    <div className="field">
                        <label>Accent color</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {COLORS.map(c => (
                                <button type="button" key={c} onClick={() => form.setData('color', c)}
                                    style={{ width: 28, height: 28, borderRadius: 8, background: c, boxShadow: form.data.color === c ? '0 0 0 2px var(--canvas), 0 0 0 4px var(--accent)' : 'inset 0 0 0 1px rgba(255,255,255,0.15)' }} />
                            ))}
                        </div>
                    </div>

                    <div className="field">
                        <label>Shift status</label>
                        <div className="seg">
                            {['on-shift', 'off'].map(s => (
                                <button type="button" key={s} className={form.data.status === s ? 'on' : ''} onClick={() => form.setData('status', s)} style={{ textTransform: 'capitalize' }}>{s.replace('-', ' ')}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--hairline)', paddingTop: 18 }}>
                        <Link href={route('trainers.index')} className="btn-ghost">Cancel</Link>
                        <button type="submit" className="btn-primary" disabled={form.processing}><Icons.Check /> {isEdit ? 'Save changes' : 'Create trainer'}</button>
                    </div>
                </form>
            </div>
        </GymLayout>
    );
}

function Err({ msg }: { msg: string }) {
    return <span style={{ color: 'var(--danger)', fontSize: 11.5 }}>{msg}</span>;
}
