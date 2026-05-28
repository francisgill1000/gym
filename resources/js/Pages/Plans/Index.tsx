import { Head, Link, router } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Kpi, Money } from '@/Components/GymCharts';
import { Icons } from '@/Components/GymIcons';

type Plan = {
    id: number; name: string; code: string; color: string; price: number;
    cycle: string; description: string | null; features: string[]; status: string; members: number;
};

export default function PlansIndex({ plans }: { plans: Plan[] }) {
    const totalMembers = plans.reduce((s, p) => s + p.members, 0);
    const mrr = plans.reduce((s, p) => p.cycle === 'per month' ? s + p.price * p.members : s, 0);

    return (
        <GymLayout active="plans" action={
            <Link href={route('plans.create')} className="btn-primary"><Icons.Plus /> New plan</Link>
        }>
            <Head title="Memberships" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Memberships</h1>
                        <p className="page-sub">{plans.length} plans · {totalMembers.toLocaleString()} subscribed members</p>
                    </div>
                </div>

                <div className="kpi-grid">
                    <Kpi hero label="MRR" value={<Money n={mrr} k />} delta={6.8} spark={[156,164,172,178,184,190,195,199,204,208,211,Math.round(mrr/1000)]} icon={<Icons.Billing />} />
                    <Kpi label="Subscribed" value={totalMembers.toLocaleString()} delta={5.2} spark={[612,648,680,705,728,744,762,781,798,812,829,totalMembers]} icon={<Icons.Members />} />
                    <Kpi label="Plans live" value={plans.filter(p => p.status !== 'draft').length} icon={<Icons.Check />} />
                    <Kpi label="Most popular" value={plans.reduce((p, q) => q.members > p.members ? q : p, plans[0] ?? { members: 0, name: '—' }).name || '—'} icon={<Icons.Star />} />
                </div>

                <div className="plan-grid">
                    {plans.map(p => (
                        <div key={p.id} className={`plan-card ${p.status === 'popular' ? 'featured' : ''}`}>
                            <div className="plan-top">
                                <span className="plan-logo" style={{ background: `${p.color}1f`, color: p.color, boxShadow: `inset 0 0 0 1px ${p.color}38` }}>{p.code}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3>{p.name}</h3>
                                    <div className="plan-price"><span className="amt"><Money n={p.price} /></span><span className="cyc">{p.cycle}</span></div>
                                </div>
                                {p.status === 'popular' && <span className="tag trial">popular</span>}
                            </div>
                            <p className="plan-desc">{p.description}</p>
                            <div className="plan-feats">
                                {p.features.map((f, j) => <div className="plan-feat" key={j}><Icons.Check /> {f}</div>)}
                            </div>
                            <div className="plan-foot">
                                <span className="plan-members"><b>{p.members.toLocaleString()}</b> {p.members === 1 ? 'member' : 'members'}</span>
                                <Link href={route('plans.edit', p.id)} className="link-accent">Edit <Icons.Chev /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GymLayout>
    );
}
