import { Head, Link, router } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { GTag, Kpi, MemberCell, Money } from '@/Components/GymCharts';
import { Icons } from '@/Components/GymIcons';

type Row = {
    id: string; pk: number; date: string; member_id: number | null; member: string;
    item: string; amount: number; method: string; status: string;
};
type Props = {
    payments: Row[];
    sums: { paid: number; refund: number };
    counts: { paid: number; failed: number };
    filters: { status: string };
};
const STATUSES = ['all', 'paid', 'pending', 'failed', 'refunded'] as const;

export default function BillingIndex({ payments, sums, counts, filters }: Props) {
    return (
        <GymLayout active="billing" action={
            <Link href={route('billing.create')} className="btn-primary"><Icons.Plus /> New invoice</Link>
        }>
            <Head title="Billing" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Billing</h1>
                        <p className="page-sub">Invoices, renewals, and refunds across all plans.</p>
                    </div>
                </div>

                <div className="kpi-grid">
                    <Kpi hero label="Collected" value={<Money n={sums.paid} k />} delta={6.8} spark={[156,164,172,178,184,190,195,199,204,208,211,Math.round(sums.paid/1000)]} icon={<Icons.Billing />} />
                    <Kpi label="Paid invoices" value={counts.paid} delta={5.1} spark={[480,500,520,540,555,568,580,590,598,604,609,counts.paid]} icon={<Icons.Check />} />
                    <Kpi label="Failed" value={counts.failed} delta={2} deltaInvert color="var(--danger)" spark={[3,4,5,4,6,7,6,5,7,8,7,counts.failed]} icon={<Icons.Alert />} />
                    <Kpi label="Refunded" value={<Money n={sums.refund} />} delta={-1.2} deltaInvert color="var(--info)" spark={[900,860,820,780,740,700,680,660,640,620,600,sums.refund]} icon={<Icons.Download />} />
                </div>

                <div className="card">
                    <div className="card-head">
                        <div>
                            <h3 className="card-title">Invoices</h3>
                            <p className="card-sub">{payments.length} shown</p>
                        </div>
                        <div className="seg">
                            {STATUSES.map(s => (
                                <button key={s} className={filters.status === s ? 'on' : ''}
                                    onClick={() => router.get(route('billing.index'), { status: s }, { preserveState: true, replace: true })}
                                    style={{ textTransform: 'capitalize' }}>{s}</button>
                            ))}
                        </div>
                    </div>
                    <table className="table">
                        <thead><tr><th>Invoice</th><th>Date</th><th>Member</th><th>Item</th><th>Method</th><th>Amount</th><th>Status</th><th style={{ width: 40 }}></th></tr></thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p.pk}>
                                    <td className="num" style={{ color: 'var(--fg-muted)', fontSize: 12 }}>{p.id}</td>
                                    <td className="muted" style={{ fontSize: 12 }}>{p.date}</td>
                                    <td><MemberCell name={p.member === 'Walk-in' ? 'WI' : p.member} /></td>
                                    <td>{p.item}</td>
                                    <td className="muted" style={{ fontFamily: 'Geist Mono', fontSize: 12 }}>{p.method}</td>
                                    <td className="num" style={{ fontWeight: 600 }}><Money n={p.amount} /></td>
                                    <td><GTag status={p.status} /></td>
                                    <td><Link href={route('billing.edit', p.pk)} className="icon-btn" title="Edit"><Icons.Edit /></Link></td>
                                </tr>
                            ))}
                            {payments.length === 0 && <tr><td colSpan={8} className="muted" style={{ textAlign: 'center', padding: 24 }}>No invoices match this filter.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </GymLayout>
    );
}
