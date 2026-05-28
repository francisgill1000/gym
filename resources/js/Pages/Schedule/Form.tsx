import { Head, Link, useForm } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Icons } from '@/Components/GymIcons';
import { FormEvent } from 'react';

type Trainer = { id: number; name: string; role: string };
type GymClass = {
    id?: number; name?: string; type?: string; trainer_id?: number | null; room?: string;
    day_of_week?: number; start_time?: string; duration?: number; capacity?: number; booked?: number;
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduleForm({ class: cls, trainers, types }: { class: GymClass | null; trainers: Trainer[]; types: string[] }) {
    const isEdit = !!cls?.id;
    const form = useForm({
        name:        cls?.name ?? '',
        type:        cls?.type ?? types[0] ?? 'Strength',
        trainer_id:  (cls?.trainer_id ?? trainers[0]?.id ?? null) as number | null,
        room:        cls?.room ?? 'Floor A',
        day_of_week: cls?.day_of_week ?? 0,
        start_time:  cls?.start_time ?? '18:00',
        duration:    cls?.duration ?? 60,
        capacity:    cls?.capacity ?? 16,
        booked:      cls?.booked ?? 0,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) form.put(route('schedule.update', { class: cls!.id }));
        else        form.post(route('schedule.store'));
    };
    const remove = () => {
        if (!isEdit) return;
        if (confirm(`Remove "${cls?.name}"?`)) form.delete(route('schedule.destroy', { class: cls!.id }));
    };

    return (
        <GymLayout active="schedule" crumb={isEdit ? 'Edit' : 'New class'} action={
            <>
                <Link href={route('schedule.index')} className="btn-ghost">Cancel</Link>
                {isEdit && <button type="button" className="btn-ghost" onClick={remove} style={{ color: 'var(--danger)' }}><Icons.Trash /> Delete</button>}
            </>
        }>
            <Head title={isEdit ? 'Edit class' : 'New class'} />
            <div className="page">
                <div className="page-head">
                    <div className="row gap-3">
                        <Link href={route('schedule.index')} className="icon-btn"><Icons.Back /></Link>
                        <div>
                            <h1 className="page-title">{isEdit ? `Edit ${cls?.name}` : 'New class'}</h1>
                            <p className="page-sub">Time, room, trainer and capacity.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
                    <div className="field-row">
                        <div className="field"><label>Class name</label><input className="input" value={form.data.name} onChange={e => form.setData('name', e.target.value)} required />{form.errors.name && <Err msg={form.errors.name} />}</div>
                        <div className="field">
                            <label>Type</label>
                            <select className="input" value={form.data.type} onChange={e => form.setData('type', e.target.value)}>
                                {types.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label>Trainer</label>
                            <select className="input" value={String(form.data.trainer_id ?? '')} onChange={e => form.setData('trainer_id', e.target.value ? Number(e.target.value) : null)}>
                                <option value="">— Unassigned —</option>
                                {trainers.map(t => <option key={t.id} value={t.id}>{t.name} · {t.role}</option>)}
                            </select>
                        </div>
                        <div className="field"><label>Room</label><input className="input" value={form.data.room} onChange={e => form.setData('room', e.target.value)} required /></div>
                    </div>

                    <div className="field">
                        <label>Day of week</label>
                        <div className="seg">
                            {DAYS.map((d, i) => (
                                <button type="button" key={d} className={form.data.day_of_week === i ? 'on' : ''} onClick={() => form.setData('day_of_week', i)}>{d}</button>
                            ))}
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field"><label>Start time</label><input type="time" className="input" value={form.data.start_time} onChange={e => form.setData('start_time', e.target.value)} required /></div>
                        <div className="field"><label>Duration (minutes)</label><input type="number" min={5} max={300} className="input" value={form.data.duration} onChange={e => form.setData('duration', Number(e.target.value))} required /></div>
                    </div>

                    <div className="field-row">
                        <div className="field"><label>Capacity</label><input type="number" min={1} className="input" value={form.data.capacity} onChange={e => form.setData('capacity', Number(e.target.value))} required /></div>
                        <div className="field"><label>Already booked</label><input type="number" min={0} className="input" value={form.data.booked} onChange={e => form.setData('booked', Number(e.target.value))} /></div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--hairline)', paddingTop: 18 }}>
                        <Link href={route('schedule.index')} className="btn-ghost">Cancel</Link>
                        <button type="submit" className="btn-primary" disabled={form.processing}><Icons.Check /> {isEdit ? 'Save changes' : 'Schedule class'}</button>
                    </div>
                </form>
            </div>
        </GymLayout>
    );
}

function Err({ msg }: { msg: string }) {
    return <span style={{ color: 'var(--danger)', fontSize: 11.5 }}>{msg}</span>;
}
