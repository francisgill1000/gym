import { Head, Link, router } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { AreaChart, BarChart, Donut, Kpi, Money, OccupancyRing, CapBar } from '@/Components/GymCharts';
import { CLASS_ICON, Icons } from '@/Components/GymIcons';

type ClassRow = {
    id: number; name: string; type: string; start: string; end: string; duration: number;
    room: string; capacity: number; booked: number; day: number;
    trainer: { id: number; name: string; role: string } | null;
};

type Props = {
    kpis: { activeMembers: number; checkinsToday: number; mrr: number; newMembers: number; occupancyNow: number; occupancyOf: number; currentInside: number };
    todayClasses: ClassRow[];
    revenue30d: { d: string; recur: number; extra: number }[];
    hourly: { h: string; n: number }[];
    membershipMix: { label: string; n: number; color: string }[];
    activity: { kind: string; who: string; what: string; when: string }[];
    totalBooked: number;
    totalCap: number;
};

const ACT_ICON: Record<string, () => JSX.Element> = {
    checkin: Icons.Checkin, join: Icons.Members, pay: Icons.Billing,
    class: Icons.Schedule, warn: Icons.Alert,
};

export default function Dashboard({ kpis, todayClasses, revenue30d, hourly, membershipMix, activity }: Props) {
    const CLASS_COLORS: Record<string, string> = {
        Strength: '#00ffcc', HIIT: '#ff8aa3', Yoga: '#a48cff', Cycle: '#6aa9ff', Boxing: '#f0b65a',
    };
    return (
        <GymLayout active="dashboard" action={
            <>
                <Link href={route('billing.create')} className="btn-ghost"><Icons.Download /> Export</Link>
                <Link href={route('members.create')} className="btn-primary"><Icons.Plus /> New member</Link>
            </>
        }>
            <Head title="Dashboard" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Good morning, Forge Fitness</h1>
                        <p className="page-sub">Today · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Business Bay, Dubai</p>
                    </div>
                    <div className="page-actions">
                        <div className="seg">
                            <button>Today</button>
                            <button className="on">30d</button>
                            <button>90d</button>
                        </div>
                    </div>
                </div>

                <div className="kpi-grid">
                    <Kpi hero label="Active members" value={kpis.activeMembers.toLocaleString()} delta={5.2} icon={<Icons.Members />} spark={[612,648,680,705,728,744,762,781,798,812,829,kpis.activeMembers]} />
                    <Kpi label="Check-ins today" value={kpis.checkinsToday} delta={8.4} icon={<Icons.Checkin />} spark={[240,262,255,288,301,276,294,312,286,305,322,kpis.checkinsToday]} />
                    <Kpi label="MRR" value={<Money n={kpis.mrr} k />} delta={6.8} icon={<Icons.Billing />} spark={[156,164,172,178,184,190,195,199,204,208,211,Math.round(kpis.mrr/1000)]} />
                    <Kpi label="New (30d)" value={kpis.newMembers} delta={11.3} icon={<Icons.Plus />} spark={[22,26,28,31,30,34,36,39,41,43,45,kpis.newMembers]} />
                </div>

                <div className="split">
                    <div className="card chart-card">
                        <div className="chart-head">
                            <div className="chart-head-left">
                                <div>
                                    <h3 className="card-title">Revenue</h3>
                                    <p className="card-sub">Memberships vs. drop-in & PT · last 30 days</p>
                                </div>
                                <div className="chart-num"><Money n={revenue30d.reduce((s, d) => s + d.recur + d.extra, 0)} /><span className="unit">collected</span></div>
                            </div>
                            <div className="legend">
                                <span className="swatch accent">Memberships</span>
                                <span className="swatch ghost">Drop-in & PT</span>
                            </div>
                        </div>
                        <AreaChart data={revenue30d} />
                        <div className="chart-foot"><span>{revenue30d[0]?.d}</span><span>{revenue30d.at(-1)?.d}</span></div>
                    </div>

                    <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                        <div className="section-row" style={{ width: '100%' }}>
                            <div>
                                <h3 className="card-title">Live occupancy</h3>
                                <p className="card-sub">Right now</p>
                            </div>
                            <span className="tag active">live</span>
                        </div>
                        <OccupancyRing pct={kpis.occupancyNow} label={`${kpis.currentInside} / ${kpis.occupancyOf}`} />
                        <div className="grid-2" style={{ width: '100%', gap: 10 }}>
                            <div className="info-row" style={{ borderTop: 0, padding: '6px 0' }}><span className="k">Gym floor</span><span className="v num">86</span></div>
                            <div className="info-row" style={{ borderTop: 0, padding: '6px 0' }}><span className="k">Studios</span><span className="v num">42</span></div>
                        </div>
                    </div>
                </div>

                <div className="split">
                    <div className="card">
                        <div className="card-head">
                            <div>
                                <h3 className="card-title">Today's classes</h3>
                                <p className="card-sub">{todayClasses.length} sessions scheduled</p>
                            </div>
                            <Link href={route('schedule.index')} className="link-accent">Full schedule <Icons.Chev /></Link>
                        </div>
                        <table className="table">
                            <thead><tr><th>Time</th><th>Class</th><th>Trainer</th><th>Room</th><th>Capacity</th></tr></thead>
                            <tbody>
                                {todayClasses.map(c => {
                                    const Icon = CLASS_ICON[c.type] || Icons.Dumbbell;
                                    const col = CLASS_COLORS[c.type] || '#00ffcc';
                                    return (
                                        <tr key={c.id} className="clickable" onClick={() => router.visit(route('schedule.show', { class: c.id }))}>
                                            <td className="num" style={{ fontWeight: 600 }}>{c.start}</td>
                                            <td>
                                                <div className="cell-customer">
                                                    <span className="g-av" style={{ width: 26, height: 26, background: `${col}22`, color: col, boxShadow: `inset 0 0 0 1px ${col}38` }}>
                                                        <Icon />
                                                    </span>
                                                    <div><div className="name">{c.name}</div><div className="sub">{c.type} · {c.duration}min</div></div>
                                                </div>
                                            </td>
                                            <td className="muted">{c.trainer?.name ?? '—'}</td>
                                            <td className="muted">{c.room}</td>
                                            <td style={{ width: 150 }}><CapBar booked={c.booked} cap={c.capacity} /></td>
                                        </tr>
                                    );
                                })}
                                {todayClasses.length === 0 && <tr><td colSpan={5} className="muted" style={{ textAlign: 'center', padding: 24 }}>No classes scheduled today.</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    <div className="card">
                        <div className="card-head"><h3 className="card-title">Activity</h3><span className="link-accent">View all <Icons.Chev /></span></div>
                        <div className="timeline" style={{ padding: '4px 18px 14px' }}>
                            {activity.map((a, i) => {
                                const Icon = ACT_ICON[a.kind] || Icons.Bolt;
                                const isWarn = a.kind === 'warn';
                                const isPay  = a.kind === 'pay';
                                return (
                                    <div className="tl-item" key={i}>
                                        <span className="tl-dot" style={isWarn ? { background: 'var(--warn-soft)', color: 'var(--warn)' } : isPay ? { background: 'var(--accent-soft)', color: 'var(--accent)' } : {}}>
                                            <Icon />
                                        </span>
                                        <div className="tl-body"><div className="t1"><b>{a.who}</b> {a.what}</div></div>
                                        <span className="tl-when">{a.when}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid-2">
                    <div className="card">
                        <div className="card-head">
                            <div>
                                <h3 className="card-title">Peak hours</h3>
                                <p className="card-sub">Check-ins by hour · today</p>
                            </div>
                            <span className="muted" style={{ fontSize: 12 }}>Busiest {hourly.reduce((a, b) => a.n > b.n ? a : b).h}:00</span>
                        </div>
                        <div className="card-pad" style={{ paddingTop: 4 }}>
                            <BarChart data={hourly} height={150} />
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-head">
                            <h3 className="card-title">Membership mix</h3>
                            <Link href={route('plans.index')} className="link-accent">Plans <Icons.Chev /></Link>
                        </div>
                        <div className="donut-card">
                            <Donut data={membershipMix} />
                            <div className="legend-list">
                                {membershipMix.map((m, i) => {
                                    const total = membershipMix.reduce((s, x) => s + x.n, 0);
                                    return (
                                        <div className="li" key={i}>
                                            <span className="dot" style={{ background: m.color }} />
                                            <span>{m.label}</span>
                                            <span className="n">{m.n}</span>
                                            <span className="pct">{total > 0 ? Math.round((m.n / total) * 100) : 0}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GymLayout>
    );
}

