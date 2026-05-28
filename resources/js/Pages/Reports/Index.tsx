import { Head } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { AreaChart, BarChart, Donut, Kpi, Money } from '@/Components/GymCharts';
import { Icons } from '@/Components/GymIcons';

type Props = {
    kpis: { netRevenue30d: number; totalVisits: number; retention: number; fillRate: number };
    revenue30d: { d: string; recur: number; extra: number }[];
    weekAttendance: { d: string; n: number }[];
    hourly: { h: string; n: number }[];
    membershipMix: { label: string; n: number; color: string }[];
};

export default function ReportsIndex({ kpis, revenue30d, weekAttendance, hourly, membershipMix }: Props) {
    const total = membershipMix.reduce((s, x) => s + x.n, 0);
    return (
        <GymLayout active="reports" action={
            <button className="btn-ghost"><Icons.Download /> Export PDF</button>
        }>
            <Head title="Reports" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Reports</h1>
                        <p className="page-sub">Performance across revenue, attendance, and retention.</p>
                    </div>
                    <div className="page-actions">
                        <div className="seg"><button>Month</button><button className="on">Quarter</button><button>Year</button></div>
                    </div>
                </div>

                <div className="kpi-grid">
                    <Kpi hero label="Net revenue (30d)" value={<Money n={kpis.netRevenue30d} k />} delta={6.8} icon={<Icons.Billing />} spark={[156,164,172,178,184,190,195,199,204,208,211,Math.round(kpis.netRevenue30d/1000)]} />
                    <Kpi label="Total visits (30d)" value={kpis.totalVisits.toLocaleString()} delta={7.2} icon={<Icons.Checkin />} spark={[72,75,78,80,83,86,88,90,91,92,93,94]} />
                    <Kpi label="Retention" value={kpis.retention} unit="%" delta={1.4} icon={<Icons.Members />} spark={[86,87,87,88,88,89,89,90,90,90,91,kpis.retention]} />
                    <Kpi label="Class fill rate" value={kpis.fillRate} unit="%" delta={4.1} icon={<Icons.Schedule />} spark={[72,74,75,77,78,79,80,81,82,82,83,kpis.fillRate]} />
                </div>

                <div className="card chart-card">
                    <div className="chart-head">
                        <div className="chart-head-left">
                            <div>
                                <h3 className="card-title">Revenue trend</h3>
                                <p className="card-sub">Recurring vs. one-off · last 30 days</p>
                            </div>
                        </div>
                        <div className="legend">
                            <span className="swatch accent">Recurring</span>
                            <span className="swatch ghost">One-off</span>
                        </div>
                    </div>
                    <AreaChart data={revenue30d} />
                    <div className="chart-foot"><span>{revenue30d[0]?.d}</span><span>{revenue30d.at(-1)?.d}</span></div>
                </div>

                <div className="grid-2">
                    <div className="card">
                        <div className="card-head">
                            <div>
                                <h3 className="card-title">Weekly attendance</h3>
                                <p className="card-sub">Check-ins by day</p>
                            </div>
                            <span className="muted" style={{ fontSize: 12 }}>Busiest Saturday</span>
                        </div>
                        <div className="card-pad" style={{ paddingTop: 4 }}>
                            <BarChart data={weekAttendance} labelKey="d" height={150} />
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-head">
                            <h3 className="card-title">Membership mix</h3>
                            <span className="muted" style={{ fontSize: 12 }}>{total.toLocaleString()} members</span>
                        </div>
                        <div className="donut-card">
                            <Donut data={membershipMix} />
                            <div className="legend-list">
                                {membershipMix.map((m, i) => (
                                    <div className="li" key={i}>
                                        <span className="dot" style={{ background: m.color }} />
                                        <span>{m.label}</span>
                                        <span className="n">{m.n}</span>
                                        <span className="pct">{total > 0 ? Math.round((m.n / total) * 100) : 0}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-head">
                        <div>
                            <h3 className="card-title">Peak hours</h3>
                            <p className="card-sub">Average check-ins by hour of day</p>
                        </div>
                    </div>
                    <div className="card-pad" style={{ paddingTop: 4 }}>
                        <BarChart data={hourly} height={160} />
                    </div>
                </div>
            </div>
        </GymLayout>
    );
}
