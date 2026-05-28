import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import GymLayout from '@/Layouts/GymLayout';
import { CapBar } from '@/Components/GymCharts';
import { Icons } from '@/Components/GymIcons';

type ClassRow = {
    id: number; name: string; type: string; start: string; end: string; duration: number;
    room: string; capacity: number; booked: number; day: number;
    trainer: { id: number; name: string; role: string } | null;
};

type Props = {
    classes: ClassRow[];
    totalCap: number; totalBooked: number; fullCount: number;
    classTypes: Record<string, string>;
};

const DAYS = [
    { name: 'Mon', date: '26' }, { name: 'Tue', date: '27' }, { name: 'Wed', date: '28' },
    { name: 'Thu', date: '29' }, { name: 'Fri', date: '30' }, { name: 'Sat', date: '31' }, { name: 'Sun', date: '01' },
];
const WEEK_TODAY = 3;
const DAY_START = 6;
const DAY_END = 21;
const HOUR_H = 78;
const NOW_MIN = 9 * 60 + 15;

const toMin = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

export default function ScheduleIndex({ classes, totalCap, totalBooked, fullCount, classTypes }: Props) {
    const [view, setView] = useState<'week' | 'list'>('week');
    const byDay = (i: number) => classes.filter(c => c.day === i).sort((a, b) => a.start.localeCompare(b.start));
    const HOURS = []; for (let h = DAY_START; h <= DAY_END; h++) HOURS.push(h);
    const gridH = (DAY_END - DAY_START) * HOUR_H;

    return (
        <GymLayout active="schedule" action={
            <Link href={route('schedule.create')} className="btn-primary"><Icons.Plus /> New class</Link>
        }>
            <Head title="Schedule" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Schedule</h1>
                        <p className="page-sub">Week of 26 May – 01 Jun · {classes.length} classes · 5 rooms</p>
                    </div>
                    <div className="page-actions">
                        <div className="seg">
                            <button className={view === 'week' ? 'on' : ''} onClick={() => setView('week')}>Week</button>
                            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>List</button>
                        </div>
                    </div>
                </div>

                <div className="tt-summary">
                    <div className="tt-sum-item">
                        <span className="tt-sum-v num">{totalBooked}<span className="dim">/{totalCap}</span></span>
                        <span className="tt-sum-l">Booked / capacity</span>
                    </div>
                    <div className="tt-sum-item">
                        <span className="tt-sum-v num">{totalCap > 0 ? Math.round(totalBooked / totalCap * 100) : 0}%</span>
                        <span className="tt-sum-l">Avg fill rate</span>
                    </div>
                    <div className="tt-sum-item">
                        <span className="tt-sum-v num" style={{ color: 'var(--warn)' }}>{fullCount}</span>
                        <span className="tt-sum-l">Full · waitlist open</span>
                    </div>
                    <div className="tt-legend">
                        {Object.entries(classTypes).map(([t, c]) => (
                            <span className="legend-chip" key={t}><i style={{ background: c }} />{t}</span>
                        ))}
                    </div>
                </div>

                {view === 'week' ? (
                    <div className="card" style={{ overflow: 'hidden' }}>
                        <div className="tt-scroll">
                            <div className="tcal" style={{ '--gridH': `${gridH}px`, '--hourH': `${HOUR_H}px` } as any}>
                                <div className="tt-corner" />
                                {DAYS.map((d, i) => (
                                    <div className={`tt-dayhead ${i === WEEK_TODAY ? 'today' : ''}`} key={i}>
                                        <span className="dn">{d.name}</span>
                                        <span className="dd">{d.date} May</span>
                                    </div>
                                ))}
                                <div className="tt-gutter">
                                    {HOURS.map(h => (
                                        <div className="tt-hour" key={h}><span>{String(h).padStart(2, '0')}:00</span></div>
                                    ))}
                                </div>
                                {DAYS.map((d, i) => (
                                    <div className={`tt-lane ${i === WEEK_TODAY ? 'today' : ''}`} key={i}>
                                        {i === WEEK_TODAY && (
                                            <div className="tt-now" style={{ top: (NOW_MIN - DAY_START * 60) / 60 * HOUR_H }}>
                                                <span className="tt-now-lab">{String(Math.floor(NOW_MIN / 60)).padStart(2, '0')}:{String(NOW_MIN % 60).padStart(2, '0')}</span>
                                            </div>
                                        )}
                                        {byDay(i).map(c => {
                                            const col = classTypes[c.type] ?? '#00ffcc';
                                            const full = c.booked >= c.capacity;
                                            const top = (toMin(c.start) - DAY_START * 60) / 60 * HOUR_H;
                                            const height = c.duration / 60 * HOUR_H - 4;
                                            const compact = c.duration <= 45;
                                            return (
                                                <div key={c.id} className={`tt-block ${full ? 'full' : ''} ${compact ? 'compact' : ''}`}
                                                    style={{ top, height, '--cc': `${col}3a`, '--cb': `${col}1c`, '--ck': col } as any}
                                                    onClick={() => router.visit(route('schedule.show', { class: c.id }))}>
                                                    <div className="tt-b-name">{c.name}</div>
                                                    <div className="tt-b-meta">{c.start}–{c.end} · {c.room}</div>
                                                    {!compact && (
                                                        <div className="tt-b-foot">
                                                            <span className="tt-b-tr">{c.trainer?.name?.split(' ')[0] ?? '—'}</span>
                                                            <span className={`tt-b-cap ${full ? 'full' : ''}`}>{full ? 'Full' : `${c.booked}/${c.capacity}`}</span>
                                                        </div>
                                                    )}
                                                    {compact && <span className={`tt-b-cap mini ${full ? 'full' : ''}`}>{c.booked}/{c.capacity}</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        {DAYS.map((d, i) => {
                            const list = byDay(i);
                            if (!list.length) return null;
                            return (
                                <div className="tt-listday" key={i}>
                                    <div className={`tt-listday-head ${i === WEEK_TODAY ? 'today' : ''}`}>
                                        <span className="dn">{d.name}</span>
                                        <span className="dd">{d.date} May</span>
                                        {i === WEEK_TODAY && <span className="tag active" style={{ marginLeft: 'auto' }}>today</span>}
                                    </div>
                                    {list.map(c => {
                                        const col = classTypes[c.type] ?? '#00ffcc';
                                        return (
                                            <div key={c.id} className="tt-listrow clickable" onClick={() => router.visit(route('schedule.show', { class: c.id }))}>
                                                <div className="tt-lr-time num">{c.start}<span className="dim">{c.end}</span></div>
                                                <span className="tt-lr-bar" style={{ background: col }} />
                                                <div className="tt-lr-main">
                                                    <div className="tt-lr-name">{c.name}</div>
                                                    <div className="tt-lr-meta">{c.type} · {c.room} · {c.trainer?.name ?? '—'}</div>
                                                </div>
                                                <div className="tt-lr-cap"><CapBar booked={c.booked} cap={c.capacity} /></div>
                                                <span className="chev-r"><Icons.Chev /></span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </GymLayout>
    );
}
