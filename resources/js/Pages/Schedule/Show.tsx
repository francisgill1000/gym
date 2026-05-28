import { Head, Link } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Avatar, CapBar, GTag, Kpi, MemberCell, Money, OccupancyRing } from '@/Components/GymCharts';
import { CLASS_ICON, Icons } from '@/Components/GymIcons';

type ClassRow = {
    id: number; name: string; type: string; start: string; end: string; duration: number;
    room: string; capacity: number; booked: number; day: number;
    trainer: { id: number; name: string; role: string } | null;
};
type Roster = { id: number; name: string; plan: string; status: string; joined: string };

export default function ScheduleShow({ class: c, roster, classTypes }: { class: ClassRow; roster: Roster[]; classTypes: Record<string, string> }) {
    const col = classTypes[c.type] ?? '#00ffcc';
    const checkedIn = roster.filter(r => r.status === 'checked-in').length;
    const waitlist = roster.filter(r => r.status === 'waitlist').length;
    const TypeIcon = CLASS_ICON[c.type] ?? Icons.Dumbbell;

    return (
        <GymLayout active="schedule" crumb={c.name} action={
            <>
                <Link href={route('schedule.edit', { class: c.id })} className="btn-ghost"><Icons.Edit /> Edit class</Link>
                <button className="btn-primary"><Icons.Plus /> Add member</button>
            </>
        }>
            <Head title={c.name} />
            <div className="page">
                <div className="page-head">
                    <div className="row gap-3">
                        <Link href={route('schedule.index')} className="icon-btn"><Icons.Back /></Link>
                        <div>
                            <div className="row gap-2" style={{ marginBottom: 4 }}>
                                <span className="g-av" style={{ width: 30, height: 30, background: `${col}22`, color: col, boxShadow: `inset 0 0 0 1px ${col}38` }}><TypeIcon /></span>
                                <h1 className="page-title" style={{ margin: 0 }}>{c.name}</h1>
                            </div>
                            <p className="page-sub">{c.type} · {c.start}–{c.end} · {c.room}</p>
                        </div>
                    </div>
                </div>

                <div className="kpi-grid">
                    <Kpi label="Booked" value={`${c.booked}/${c.capacity}`} delta={4} icon={<Icons.Members />} spark={[8,9,10,11,12,13,14,14,15,15,16,c.booked]} />
                    <Kpi label="Checked in" value={checkedIn} delta={0} icon={<Icons.Checkin />} spark={[0,0,1,1,2,2,3,3,3,3,3,checkedIn]} />
                    <Kpi label="Waitlist" value={waitlist} delta={1} deltaInvert color="var(--warn)" icon={<Icons.Clock />} spark={[0,0,1,1,1,2,2,1,1,1,1,waitlist]} />
                    <Kpi label="Class revenue" value={<Money n={c.booked * 45} />} delta={6.2} icon={<Icons.Billing />} spark={[300,360,420,480,540,560,600,620,660,680,700,c.booked*45]} />
                </div>

                <div className="split">
                    <div className="card">
                        <div className="card-head">
                            <div>
                                <h3 className="card-title">Roster</h3>
                                <p className="card-sub">{roster.length} members · {checkedIn} checked in</p>
                            </div>
                        </div>
                        <table className="table">
                            <thead><tr><th>Member</th><th>Plan</th><th>Status</th><th>Checked in</th></tr></thead>
                            <tbody>
                                {roster.length === 0 && <tr><td colSpan={4} className="muted" style={{ textAlign: 'center', padding: 18 }}>Roster will appear once members book.</td></tr>}
                                {roster.map(r => (
                                    <tr key={r.id}>
                                        <td><MemberCell name={r.name} /></td>
                                        <td className="muted">{r.plan}</td>
                                        <td><GTag status={r.status} /></td>
                                        <td className="num muted">{r.joined}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                            <h3 className="card-title" style={{ alignSelf: 'flex-start' }}>Capacity</h3>
                            <OccupancyRing pct={Math.round(c.booked / c.capacity * 100)} label={`${c.booked} / ${c.capacity}`} />
                            <p className="muted" style={{ fontSize: 12, textAlign: 'center', margin: 0 }}>
                                {c.booked >= c.capacity ? 'Class is full — waitlist open' : `${c.capacity - c.booked} spots remaining`}
                            </p>
                        </div>

                        <div className="card card-pad">
                            <h3 className="card-title" style={{ marginBottom: 10 }}>Trainer</h3>
                            {c.trainer ? (
                                <>
                                    <div className="trainer-top">
                                        <Avatar name={c.trainer.name} size={44} />
                                        <div className="who">
                                            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{c.trainer.name}</h3>
                                            <span className="role" style={{ color: 'var(--accent)', fontSize: 12 }}>{c.trainer.role}</span>
                                        </div>
                                    </div>
                                    <div className="info-row" style={{ marginTop: 6 }}><span className="k">Room</span><span className="v">{c.room}</span></div>
                                    <div className="info-row"><span className="k">Duration</span><span className="v">{c.duration} min</span></div>
                                    <div className="info-row"><span className="k">Type</span><span className="v">{c.type}</span></div>
                                </>
                            ) : <p className="muted">Trainer unassigned.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </GymLayout>
    );
}
