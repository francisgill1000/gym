import { Head, Link } from '@inertiajs/react';
import GymLayout from '@/Layouts/GymLayout';
import { Avatar, GTag, Kpi } from '@/Components/GymCharts';
import { Icons } from '@/Components/GymIcons';

type Trainer = {
    id: number; name: string; role: string; specialty: string; color: string;
    clients: number; classes_wk: number; rating: number; status: string;
};

export default function TrainersIndex({ trainers, onShift }: { trainers: Trainer[]; onShift: number }) {
    return (
        <GymLayout active="trainers" action={
            <Link href={route('trainers.create')} className="btn-primary"><Icons.Plus /> Add trainer</Link>
        }>
            <Head title="Trainers" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Trainers</h1>
                        <p className="page-sub">{trainers.length} coaches · {onShift} on shift now</p>
                    </div>
                </div>

                <div className="kpi-grid">
                    <Kpi label="Coaches" value={trainers.length} delta={1} icon={<Icons.Trainers />} spark={[4,4,5,5,5,5,6,6,6,6,6,trainers.length]} />
                    <Kpi label="On shift" value={onShift} icon={<Icons.Bolt />} spark={[2,3,2,3,3,2,3,3,2,3,3,onShift]} />
                    <Kpi label="Avg rating" value={(trainers.reduce((s, t) => s + Number(t.rating), 0) / Math.max(1, trainers.length)).toFixed(1)} unit="★" delta={0.1} color="var(--warn)" icon={<Icons.Star />} spark={[4.6,4.6,4.7,4.7,4.7,4.8,4.8,4.8,4.8,4.8,4.8,4.8]} />
                    <Kpi label="Total clients" value={trainers.reduce((s, t) => s + Number(t.clients), 0)} delta={6} icon={<Icons.Members />} spark={[88,92,96,101,104,108,112,115,118,121,124,trainers.reduce((s, t) => s + Number(t.clients), 0)]} />
                </div>

                <div className="trainer-grid">
                    {trainers.map(t => (
                        <Link key={t.id} href={route('trainers.edit', t.id)} className="trainer-card">
                            <div className="trainer-top">
                                <Avatar name={t.name} size={48} />
                                <div className="who">
                                    <h3>{t.name}</h3>
                                    <div className="role">{t.role}</div>
                                </div>
                                <GTag status={t.status} label={t.status === 'on-shift' ? 'on shift' : 'off'} />
                            </div>
                            <div className="trainer-spec">{t.specialty}</div>
                            <div className="trainer-stats">
                                <div className="s"><span className="v">{t.clients}</span><span className="l">Clients</span></div>
                                <div className="s"><span className="v">{t.classes_wk}</span><span className="l">Classes/wk</span></div>
                                <div className="s"><span className="v"><Icons.Star />{t.rating}</span><span className="l">Rating</span></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </GymLayout>
    );
}
