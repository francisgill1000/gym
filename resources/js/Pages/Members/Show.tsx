import { Head, Link } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Avatar, BarChart, GTag, Kpi, Money } from '@/Components/GymCharts';
import { Icons } from '@/Components/GymIcons';

type Member = {
    id: number; name: string; email: string; plan: string; status: string;
    joined_at: string; last_visit: string; visits_30d: number; mrr: number;
    phone?: string; emergency_contact?: string; access_method?: string;
    tenure_months: number;
};
type Payment = { id: string; date: string; item: string; amount: number; status: string };

export default function MemberShow({ member, payments }: { member: Member; payments: Payment[] }) {
    const att = [14, 18, 12, 21, 16, 19, member.visits_30d || 21];
    const events = [
        { ic: <Icons.Checkin />, t1: <><b>Checked in</b> at the main turnstile</>, t2: member.last_visit, when: 'now' },
        { ic: <Icons.Schedule />, t1: <>Booked <b>Power Hour</b> with Diego Santos</>, t2: 'Floor A · 18:00', when: '2d' },
        { ic: <Icons.Billing />, t1: <><b>{member.plan}</b> renewed</>, t2: member.mrr > 0 ? `AED ${member.mrr}` : '—', when: '8d' },
        { ic: <Icons.Star />, t1: <>Completed <b>InBody scan</b></>, t2: 'Body-fat −1.4%', when: '21d' },
        { ic: <Icons.Members />, t1: <><b>Joined</b> Forge Fitness</>, t2: member.plan, when: member.joined_at },
    ];

    return (
        <GymLayout active="members" crumb={member.name} action={
            <>
                <Link href={route('billing.create')} className="btn-ghost"><Icons.Billing /> Manage billing</Link>
                <Link href={route('members.edit', member.id)} className="btn-primary"><Icons.Edit /> Edit member</Link>
            </>
        }>
            <Head title={member.name} />
            <div className="page">
                <div className="page-head">
                    <div className="row gap-3">
                        <Link href={route('members.index')} className="icon-btn"><Icons.Back /></Link>
                        <div>
                            <h1 className="page-title">{member.name}</h1>
                            <p className="page-sub">Member since {member.joined_at}</p>
                        </div>
                    </div>
                </div>

                <div className="profile-grid">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="card profile-card">
                            <Avatar name={member.name} size={84} />
                            <div>
                                <h2 className="profile-name">{member.name}</h2>
                                <p className="profile-email">{member.email}</p>
                            </div>
                            <GTag status={member.status} />
                            <div className="profile-stats">
                                <div className="ps"><div className="v">{member.visits_30d}</div><div className="l">Visits 30d</div></div>
                                <div className="ps"><div className="v">{member.mrr > 0 ? member.mrr : '—'}</div><div className="l">AED / mo</div></div>
                                <div className="ps"><div className="v">{member.tenure_months}<span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>mo</span></div><div className="l">Tenure</div></div>
                            </div>
                        </div>

                        <div className="card card-pad">
                            <h3 className="card-title" style={{ marginBottom: 6 }}>Details</h3>
                            <div className="info-row"><span className="k">Plan</span><span className="v">{member.plan}</span></div>
                            <div className="info-row"><span className="k">Status</span><span className="v"><GTag status={member.status} /></span></div>
                            <div className="info-row"><span className="k">Joined</span><span className="v">{member.joined_at}</span></div>
                            <div className="info-row"><span className="k">Last visit</span><span className="v">{member.last_visit}</span></div>
                            <div className="info-row"><span className="k">Access</span><span className="v">{member.access_method ?? 'App QR'}</span></div>
                            {member.phone && <div className="info-row"><span className="k">Phone</span><span className="v">{member.phone}</span></div>}
                            {member.emergency_contact && <div className="info-row"><span className="k">Emergency</span><span className="v">{member.emergency_contact}</span></div>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="grid-3">
                            <Kpi label="Visits 30d" value={member.visits_30d} delta={6} spark={[2,3,3,4,4,5,5,4,5,6,5,member.visits_30d || 1]} icon={<Icons.Checkin />} />
                            <Kpi label="Classes 30d" value="9" delta={12.5} spark={[1,2,2,3,4,5,6,6,7,8,8,9]} icon={<Icons.Schedule />} />
                            <Kpi label="PT sessions" value="3" delta={0} spark={[0,1,1,1,2,2,2,3,3,3,3,3]} icon={<Icons.Bolt />} />
                        </div>

                        <div className="card">
                            <div className="card-head">
                                <h3 className="card-title">Attendance</h3>
                                <span className="card-sub">Last 7 weeks</span>
                            </div>
                            <div className="card-pad" style={{ paddingTop: 0 }}>
                                <BarChart data={att.map((n, i) => ({ n, d: `W${i + 1}` }))} labelKey="d" height={120} />
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-head">
                                <h3 className="card-title">Payment history</h3>
                                <Link href={route('billing.index')} className="link-accent">All invoices <Icons.Chev /></Link>
                            </div>
                            <table className="table">
                                <thead><tr><th>Invoice</th><th>Date</th><th>Item</th><th>Amount</th><th>Status</th></tr></thead>
                                <tbody>
                                    {payments.length === 0 && <tr><td colSpan={5} className="muted" style={{ padding: 18, textAlign: 'center' }}>No payments yet.</td></tr>}
                                    {payments.map(p => (
                                        <tr key={p.id}>
                                            <td className="num" style={{ color: 'var(--fg-muted)', fontSize: 12 }}>{p.id}</td>
                                            <td className="muted" style={{ fontSize: 12 }}>{p.date}</td>
                                            <td>{p.item}</td>
                                            <td className="num" style={{ fontWeight: 600 }}><Money n={p.amount} /></td>
                                            <td><GTag status={p.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="card card-pad">
                            <h3 className="card-title" style={{ marginBottom: 4 }}>Timeline</h3>
                            <div className="timeline">
                                {events.map((e, i) => (
                                    <div className="tl-item" key={i}>
                                        <span className="tl-dot">{e.ic}</span>
                                        <div className="tl-body"><div className="t1">{e.t1}</div><div className="t2">{e.t2}</div></div>
                                        <span className="tl-when">{e.when}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GymLayout>
    );
}
