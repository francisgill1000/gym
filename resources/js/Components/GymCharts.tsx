import { useMemo, useRef, useState } from 'react';
import { Icons } from './GymIcons';

type N = number;

/* ---------- Sparkline ---------- */
export function Sparkline({ data, color = 'var(--accent)', height = 36, fill = true }: { data: N[]; color?: string; height?: number; fill?: boolean }) {
    const w = 100;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = (max - min) || 1;
    const step = w / Math.max(1, data.length - 1);
    const pts = data.map((v, i) => [i * step, height - 4 - ((v - min) / range) * (height - 8)] as [number, number]);
    const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
    const area = path + ` L${w},${height} L0,${height} Z`;
    const id = useMemo(() => 'g' + Math.random().toString(36).slice(2, 7), []);
    return (
        <svg className="spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {fill && <path d={area} fill={`url(#${id})`} />}
            <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ---------- Delta pill ---------- */
export function Delta({ value, suffix = '%', invert = false }: { value: N; suffix?: string; invert?: boolean }) {
    const up = value > 0;
    const down = value < 0;
    const good = invert ? down : up;
    const bad = invert ? up : down;
    const cls = value === 0 ? 'flat' : good ? 'up' : bad ? 'down' : 'flat';
    return (
        <span className={`delta ${cls}`}>
            {value !== 0 && (up ? <Icons.ArrowUp /> : <Icons.ArrowDown />)}
            {value > 0 ? '+' : ''}
            {value}
            {suffix}
        </span>
    );
}

/* ---------- Area chart ---------- */
export function AreaChart({ data, height = 240 }: { data: { d: string; recur: N; extra: N }[]; height?: number }) {
    const ref = useRef<SVGSVGElement>(null);
    const [hover, setHover] = useState<number | null>(null);
    const w = 800;
    const padL = 36, padR = 12, padT = 16, padB = 28;
    const innerW = w - padL - padR;
    const innerH = height - padT - padB;
    const series = data.map(d => d.recur + d.extra);
    const max = Math.max(1, Math.ceil(Math.max(...series) / 1000) * 1000);
    const stepX = innerW / Math.max(1, data.length - 1);
    const y = (v: N) => padT + innerH - (v / max) * innerH;
    const x = (i: N) => padL + i * stepX;
    const recurPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.recur)}`).join(' ');
    const totalPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.recur + d.extra)}`).join(' ');
    const recurArea = recurPath + ` L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
    const totalArea = totalPath + ` L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
    const ticks = 4;
    const yTicks = Array.from({ length: ticks + 1 }, (_, i) => Math.round((max / ticks) * i));
    const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * w;
        const i = Math.round((px - padL) / stepX);
        if (i >= 0 && i < data.length) setHover(i);
    };
    return (
        <div style={{ position: 'relative' }}>
            <svg ref={ref} className="chart-svg" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
                <defs>
                    <linearGradient id="total-grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="recur-grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.06" />
                    </linearGradient>
                </defs>
                {yTicks.map((t, i) => (
                    <g key={i}>
                        <line x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} stroke="var(--grid-line)" strokeWidth="1" />
                        <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize="9.5" fill="var(--fg-dim)" fontFamily="Geist Mono">
                            {t.toLocaleString()}
                        </text>
                    </g>
                ))}
                <path d={totalArea} fill="url(#total-grad)" />
                <path d={recurArea} fill="url(#recur-grad)" />
                <path d={totalPath} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d={recurPath} fill="none" stroke="var(--accent-2)" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
                {data.map((d, i) => (i % 5 === 0 || i === data.length - 1 ? (
                    <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fontSize="9.5" fill="var(--fg-dim)" fontFamily="Geist Mono">{d.d}</text>
                ) : null))}
                {hover !== null && (
                    <g>
                        <line x1={x(hover)} x2={x(hover)} y1={padT} y2={height - padB} stroke="var(--hairline-strong)" strokeDasharray="2 3" />
                        <circle cx={x(hover)} cy={y(data[hover].recur + data[hover].extra)} r="4" fill="var(--accent)" stroke="var(--canvas)" strokeWidth="2" />
                        <circle cx={x(hover)} cy={y(data[hover].recur)} r="3" fill="var(--accent-2)" stroke="var(--canvas)" strokeWidth="2" />
                    </g>
                )}
            </svg>
        </div>
    );
}

/* ---------- Bar chart ---------- */
export function BarChart({ data, height = 150, accessor = (d: any) => d.n, labelKey = 'h', highlightMax = true }: any) {
    const max = Math.max(...data.map(accessor), 1);
    return (
        <div className="barchart" style={{ height }}>
            {data.map((d: any, i: number) => {
                const v = accessor(d);
                const hi = highlightMax && v === max;
                return (
                    <div className="barchart-col" key={i}>
                        <div className="barchart-track">
                            <div className="barchart-fill" style={{ height: `${(v / max) * 100}%`, background: hi ? 'var(--accent)' : 'var(--surface-3)' }} />
                        </div>
                        <span className="barchart-lab">{d[labelKey]}</span>
                    </div>
                );
            })}
        </div>
    );
}

/* ---------- Donut ---------- */
export function Donut({ data, size = 150 }: { data: { label: string; n: number; color: string }[]; size?: number }) {
    const total = data.reduce((s, d) => s + d.n, 0);
    const r = size / 2 - 10;
    const c = 2 * Math.PI * r;
    let acc = 0;
    return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="donut">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="14" />
            {data.map((d, i) => {
                const frac = total > 0 ? d.n / total : 0;
                const seg = (
                    <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={d.color} strokeWidth="14"
                        strokeDasharray={`${c * frac} ${c}`} strokeDashoffset={-c * acc}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="butt" />
                );
                acc += frac;
                return seg;
            })}
            <text x={size / 2} y={size / 2 - 4} textAnchor="middle" className="donut-total">{total}</text>
            <text x={size / 2} y={size / 2 + 13} textAnchor="middle" className="donut-cap">members</text>
        </svg>
    );
}

/* ---------- Occupancy ring ---------- */
export function OccupancyRing({ pct, size = 132, label }: { pct: N; size?: N; label?: string }) {
    const r = size / 2 - 11;
    const c = 2 * Math.PI * r;
    const off = c * (1 - pct / 100);
    const col = pct >= 85 ? 'var(--danger)' : pct >= 60 ? 'var(--accent)' : 'var(--info)';
    return (
        <div className="occ-ring" style={{ width: size, height: size }}>
            <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="9" />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={c} strokeDashoffset={off} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
            </svg>
            <div className="occ-mid">
                <div className="occ-pct">{pct}<span>%</span></div>
                {label && <div className="occ-lab">{label}</div>}
            </div>
        </div>
    );
}

/* ---------- Capacity bar ---------- */
export function CapBar({ booked, cap }: { booked: N; cap: N }) {
    const pct = Math.min(100, (booked / cap) * 100);
    const col = pct >= 100 ? 'var(--danger)' : pct >= 80 ? 'var(--warn)' : 'var(--accent)';
    return (
        <div className="capbar">
            <div className="capbar-track"><span style={{ width: `${pct}%`, background: col }} /></div>
            <span className="capbar-n num">{booked}/{cap}</span>
        </div>
    );
}

/* ---------- Avatar / initials ---------- */
const PAL = ['#00ffcc', '#6aa9ff', '#f0b65a', '#a48cff', '#ff8aa3', '#34e6a4'];
export function gColor(name: string) {
    let h = 0;
    for (const c of name) h = ((h * 31 + c.charCodeAt(0)) >>> 0);
    return PAL[h % PAL.length];
}
export function gInit(name: string) {
    return name.split(' ').filter(Boolean).map(s => s[0]).slice(0, 2).join('').toUpperCase();
}
export function Avatar({ name, size = 28 }: { name: string; size?: N }) {
    const c = gColor(name);
    return (
        <span className="g-av" style={{ width: size, height: size, fontSize: size * 0.4, background: `${c}22`, color: c, boxShadow: `inset 0 0 0 1px ${c}38` }}>
            {gInit(name)}
        </span>
    );
}
export function MemberCell({ name, sub }: { name: string; sub?: string }) {
    return (
        <div className="cell-customer">
            <Avatar name={name} />
            <div>
                <div className="name">{name}</div>
                {sub && <div className="sub">{sub}</div>}
            </div>
        </div>
    );
}

/* ---------- Status tag ---------- */
const TAG_MAP: Record<string, string> = {
    active: 'active', 'checked-in': 'active', paid: 'active', operational: 'active', live: 'active', 'on-shift': 'active',
    trial: 'trial', booked: 'trial', pending: 'trial', popular: 'trial', maintenance: 'trial',
    frozen: 'refunded', waitlist: 'refunded',
    expired: 'canceled', 'no-show': 'canceled', failed: 'canceled', 'out-of-service': 'canceled', canceled: 'canceled',
    off: 'draft', refunded: 'refunded',
};
export function GTag({ status, label }: { status: string; label?: string }) {
    return <span className={`tag ${TAG_MAP[status] || 'draft'}`}>{label || status}</span>;
}

/* ---------- KPI tile ---------- */
export function Kpi({ label, value, unit, delta, deltaInvert, spark, color = 'var(--accent)', icon, hero }:
    { label: string; value: any; unit?: string; delta?: N; deltaInvert?: boolean; spark?: N[]; color?: string; icon?: any; hero?: boolean }) {
    return (
        <div className={`kpi ${hero ? 'kpi-hero' : ''}`}>
            <div className="row">
                <span className="label">{label}</span>
                {icon && <span className="ico">{icon}</span>}
            </div>
            <div className="value">
                {value}
                {unit && <span className="unit">{unit}</span>}
            </div>
            <div className="row" style={{ marginTop: 2 }}>
                {typeof delta === 'number' && <Delta value={delta} invert={deltaInvert} />}
            </div>
            {spark && <div style={{ marginTop: 12 }}><Sparkline data={spark} color={color} /></div>}
        </div>
    );
}

/* ---------- Currency formatter ---------- */
export function Money({ n, k = false, currency = 'AED' }: { n: N; k?: boolean; currency?: string }) {
    const v = k && n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n.toLocaleString();
    return <span className="num"><span className="ccy">{currency} </span>{v}</span>;
}
