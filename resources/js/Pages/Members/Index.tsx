import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import GymLayout from '@/Layouts/GymLayout';
import { GTag, Kpi, MemberCell, Money } from '@/Components/GymCharts';
import { Icons } from '@/Components/GymIcons';

type Member = {
    id: number; name: string; email: string; plan_id: number | null; plan: string;
    status: string; joined_at: string; last_visit: string; visits_30d: number; mrr: number;
};

type Props = {
    members: Member[];
    counts: { all: number; active: number; trial: number; frozen: number; expired: number };
    filters: { q: string; status: string };
};

const STATUSES = ['all', 'active', 'trial', 'frozen', 'expired'] as const;

export default function MembersIndex({ members, counts, filters }: Props) {
    const [q, setQ] = useState(filters.q);
    const [status, setStatus] = useState(filters.status);

    const apply = (next: Partial<{ q: string; status: string }>) => {
        const newQ      = next.q ?? q;
        const newStatus = next.status ?? status;
        router.get(route('members.index'), { q: newQ, status: newStatus }, { preserveState: true, replace: true });
    };

    return (
        <GymLayout active="members" action={
            <Link href={route('members.create')} className="btn-primary"><Icons.Plus /> Add member</Link>
        }>
            <Head title="Members" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Members</h1>
                        <p className="page-sub">{counts.active.toLocaleString()} active · {counts.trial} on trial · {counts.frozen} frozen · {counts.expired} expired</p>
                    </div>
                    <div className="page-actions">
                        <button className="btn-ghost"><Icons.Download /> Export CSV</button>
                    </div>
                </div>

                <div className="kpi-grid">
                    <Kpi label="Active members" value={counts.active.toLocaleString()} delta={5.2} spark={[612,648,680,705,728,744,762,781,798,812,829,counts.active]} icon={<Icons.Members />} />
                    <Kpi label="Trial" value={counts.trial} delta={11.3} spark={[1,2,2,3,3,4,4,5,5,5,5,counts.trial]} icon={<Icons.Plus />} />
                    <Kpi label="Frozen" value={counts.frozen} delta={0} spark={[2,2,1,2,1,1,2,1,1,1,1,counts.frozen]} icon={<Icons.Clock />} />
                    <Kpi label="Expired" value={counts.expired} delta={-0.5} deltaInvert spark={[3,3,3,2,2,2,2,1,1,1,1,counts.expired]} color="var(--danger)" icon={<Icons.Alert />} />
                </div>

                <div className="card">
                    <div className="card-head">
                        <div>
                            <h3 className="card-title">All members</h3>
                            <p className="card-sub">{members.length} shown</p>
                        </div>
                        <div className="row gap-2">
                            <div className="search" style={{ width: 220, marginLeft: 0 }}>
                                <Icons.Search />
                                <input placeholder="Filter members…" value={q} onChange={e => { setQ(e.target.value); apply({ q: e.target.value }); }} />
                            </div>
                            <div className="seg">
                                {STATUSES.map(s => (
                                    <button key={s} className={status === s ? 'on' : ''} onClick={() => { setStatus(s); apply({ status: s }); }} style={{ textTransform: 'capitalize' }}>{s}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <table className="table">
                        <thead>
                            <tr><th>Member</th><th>Plan</th><th>Status</th><th>Visits (30d)</th><th>Last visit</th><th>Monthly</th><th style={{ width: 70 }}></th></tr>
                        </thead>
                        <tbody>
                            {members.map(m => (
                                <tr key={m.id} className="clickable" onClick={() => router.visit(route('members.show', m.id))}>
                                    <td><MemberCell name={m.name} sub={m.email} /></td>
                                    <td>{m.plan}</td>
                                    <td><GTag status={m.status} /></td>
                                    <td className="num">{m.visits_30d}</td>
                                    <td className="muted" style={{ fontSize: 12 }}>{m.last_visit}</td>
                                    <td className="num">{m.mrr > 0 ? <Money n={m.mrr} /> : <span className="dim">—</span>}</td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <Link href={route('members.edit', m.id)} className="icon-btn" title="Edit"><Icons.Edit /></Link>
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && <tr><td colSpan={7} className="muted" style={{ textAlign: 'center', padding: 24 }}>No members match these filters.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </GymLayout>
    );
}
