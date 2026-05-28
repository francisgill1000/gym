import { Head, useForm } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Kpi, MemberCell, OccupancyRing } from '@/Components/GymCharts';
import { Icons } from '@/Components/GymIcons';
import { FormEvent } from 'react';

type Row = { id: number; name: string; plan: string; gate: string; method: string; time: string };
type Props = {
    checkins: Row[]; todayCount: number; dayPasses: number;
    currentInside: number; occupancy: number; capacity: number;
};

export default function CheckinIndex({ checkins, todayCount, dayPasses, currentInside, occupancy, capacity }: Props) {
    const form = useForm({ name: '', gate: 'Front desk', method: 'Front desk' });
    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(route('checkin.store'), { onSuccess: () => form.reset() });
    };

    return (
        <GymLayout active="checkin">
            <Head title="Check-in" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <div className="row gap-2" style={{ marginBottom: 4 }}>
                            <h1 className="page-title" style={{ margin: 0 }}>Check-in</h1>
                            <span className="tag active">live</span>
                        </div>
                        <p className="page-sub">Front desk &amp; turnstile activity · {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    </div>
                </div>

                <div className="kpi-grid">
                    <Kpi hero label="Check-ins today" value={todayCount} delta={8.4} spark={[240,262,255,288,301,276,294,312,286,305,322,todayCount]} icon={<Icons.Checkin />} />
                    <Kpi label="Currently in" value={currentInside} delta={3} spark={[44,52,60,48,55,63,70,78,66,58,64,71]} icon={<Icons.Members />} />
                    <Kpi label="Day passes" value={dayPasses} delta={2} spark={[3,4,5,4,6,7,6,8,7,9,8,dayPasses]} color="var(--warn)" icon={<Icons.Card />} />
                    <Kpi label="Peak today" value="18:00" icon={<Icons.Clock />} />
                </div>

                <div className="split">
                    <div className="card">
                        <div className="card-head">
                            <div>
                                <h3 className="card-title">Recent check-ins</h3>
                                <p className="card-sub">Most recent first</p>
                            </div>
                        </div>
                        <table className="table">
                            <thead><tr><th>Member</th><th>Plan</th><th>Gate</th><th>Method</th><th>Time</th></tr></thead>
                            <tbody>
                                {checkins.length === 0 && <tr><td colSpan={5} className="muted" style={{ textAlign: 'center', padding: 18 }}>No check-ins yet today.</td></tr>}
                                {checkins.map(c => (
                                    <tr key={c.id}>
                                        <td><MemberCell name={c.name.startsWith('Walk-in') ? 'WI' : c.name} /></td>
                                        <td className="muted">{c.plan}</td>
                                        <td className="muted">{c.gate}</td>
                                        <td className="muted" style={{ fontFamily: 'Geist Mono', fontSize: 12 }}>{c.method}</td>
                                        <td className="num" style={{ fontWeight: 600 }}>{c.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                            <div className="section-row" style={{ width: '100%' }}>
                                <h3 className="card-title">In the building</h3>
                                <span className="tag active">live</span>
                            </div>
                            <OccupancyRing pct={occupancy} label={`${currentInside} / ${capacity}`} />
                        </div>

                        <div className="card card-pad">
                            <h3 className="card-title" style={{ marginBottom: 12 }}>Quick check-in</h3>
                            <form onSubmit={submit}>
                                <div className="field">
                                    <div className="search" style={{ width: '100%', marginLeft: 0 }}>
                                        <Icons.Search />
                                        <input placeholder="Member name…" value={form.data.name} onChange={e => form.setData('name', e.target.value)} />
                                    </div>
                                </div>
                                <div className="field-row" style={{ marginTop: 12 }}>
                                    <div className="field"><label>Gate</label><input className="input" value={form.data.gate} onChange={e => form.setData('gate', e.target.value)} /></div>
                                    <div className="field"><label>Method</label><input className="input" value={form.data.method} onChange={e => form.setData('method', e.target.value)} /></div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={form.processing}><Icons.Check /> Check in</button>
                                </div>
                            </form>
                            <p className="muted" style={{ fontSize: 11.5, marginTop: 12, textAlign: 'center' }}>Members can also self check-in at the turnstile via the Eloquent app.</p>
                        </div>
                    </div>
                </div>
            </div>
        </GymLayout>
    );
}
