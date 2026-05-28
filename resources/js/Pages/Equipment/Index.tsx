import { Head, Link, router } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { GTag, Kpi } from '@/Components/GymCharts';
import { Icons } from '@/Components/GymIcons';

type Unit = {
    id: number; name: string; code: string; zone: string; category: string;
    status: string; last_serviced_at: string | null; uses_lifetime: number;
};
type Props = { units: Unit[]; counts: { all: number; operational: number; maintenance: number; out_of_service: number } };

const DOT: Record<string, string> = {
    operational: 'var(--accent)', maintenance: 'var(--warn)', 'out-of-service': 'var(--danger)',
};

export default function EquipmentIndex({ units, counts }: Props) {
    return (
        <GymLayout active="equipment" action={
            <Link href={route('equipment.create')} className="btn-primary"><Icons.Plus /> Add unit</Link>
        }>
            <Head title="Equipment" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Equipment</h1>
                        <p className="page-sub">{counts.all} tracked units across {Array.from(new Set(units.map(u => u.zone))).length} zones</p>
                    </div>
                </div>

                <div className="kpi-grid">
                    <Kpi label="Total units" value={counts.all} icon={<Icons.Equipment />} spark={[6,6,7,7,8,8,8,8,8,8,8,counts.all]} />
                    <Kpi label="Operational" value={counts.operational} delta={0} icon={<Icons.Check />} spark={[5,5,6,6,6,6,6,6,6,6,6,counts.operational]} />
                    <Kpi label="In maintenance" value={counts.maintenance} delta={1} deltaInvert color="var(--warn)" icon={<Icons.Bolt />} spark={[0,1,0,1,1,0,1,1,0,1,1,counts.maintenance]} />
                    <Kpi label="Out of service" value={counts.out_of_service} delta={1} deltaInvert color="var(--danger)" icon={<Icons.Alert />} spark={[0,0,1,0,0,1,0,0,1,0,1,counts.out_of_service]} />
                </div>

                <div className="card">
                    <div className="card-head">
                        <div>
                            <h3 className="card-title">All equipment</h3>
                            <p className="card-sub">Sorted by zone</p>
                        </div>
                    </div>
                    <table className="table">
                        <thead><tr><th>Unit</th><th>ID</th><th>Zone</th><th>Category</th><th>Last service</th><th>Lifetime uses</th><th>Status</th><th style={{ width: 40 }}></th></tr></thead>
                        <tbody>
                            {units.map(u => (
                                <tr key={u.id} className="clickable" onClick={() => router.visit(route('equipment.edit', u.id))}>
                                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                                    <td className="num muted" style={{ fontSize: 12 }}>{u.code}</td>
                                    <td className="muted">{u.zone}</td>
                                    <td className="muted">{u.category}</td>
                                    <td className="muted" style={{ fontSize: 12 }}>{u.last_serviced_at ?? '—'}</td>
                                    <td className="num">{u.uses_lifetime.toLocaleString()}</td>
                                    <td>
                                        <span className="eq-dot" style={{ background: DOT[u.status] ?? 'var(--fg-dim)' }} />
                                        <GTag status={u.status} label={u.status.replace(/-/g, ' ')} />
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <Link href={route('equipment.edit', u.id)} className="icon-btn" title="Edit"><Icons.Edit /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </GymLayout>
    );
}
