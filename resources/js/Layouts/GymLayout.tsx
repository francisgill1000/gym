import { Link, router, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Icons } from '@/Components/GymIcons';

type SharedProps = {
    auth?: { user?: { name?: string; email?: string } };
    gym?: { name: string; location: string; currency: string; capacity: number };
    flash?: { success?: string; error?: string };
};

type NavItem = { id: string; label: string; route: string; icon: () => ReactNode; badge?: string | number; live?: boolean; dot?: boolean };
type NavGroup = { group: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
    { group: 'Overview', items: [
        { id: 'dashboard', label: 'Dashboard', route: 'dashboard', icon: Icons.Dash },
    ]},
    { group: 'Members', items: [
        { id: 'members', label: 'Members',     route: 'members.index', icon: Icons.Members },
        { id: 'checkin', label: 'Check-in',    route: 'checkin.index', icon: Icons.Checkin, live: true },
        { id: 'plans',   label: 'Memberships', route: 'plans.index',   icon: Icons.Plans },
    ]},
    { group: 'Activity', items: [
        { id: 'schedule', label: 'Schedule', route: 'schedule.index', icon: Icons.Schedule },
        { id: 'trainers', label: 'Trainers', route: 'trainers.index', icon: Icons.Trainers },
    ]},
    { group: 'Operations', items: [
        { id: 'billing',   label: 'Billing',   route: 'billing.index',   icon: Icons.Billing },
        { id: 'equipment', label: 'Equipment', route: 'equipment.index', icon: Icons.Equipment, dot: true },
        { id: 'reports',   label: 'Reports',   route: 'reports.index',   icon: Icons.Reports },
        { id: 'settings',  label: 'Settings',  route: 'settings.index',  icon: Icons.Settings },
    ]},
];

const PAGE_TITLE: Record<string, string> = {
    dashboard: 'Dashboard', members: 'Members', checkin: 'Check-in', plans: 'Memberships',
    schedule: 'Schedule', trainers: 'Trainers', billing: 'Billing', equipment: 'Equipment',
    reports: 'Reports', settings: 'Settings',
};

export default function GymLayout({
    active, crumb, children, action,
}: {
    active: string;
    crumb?: ReactNode;
    children: ReactNode;
    action?: ReactNode;
}) {
    const { props } = usePage<any>();
    const shared = props as SharedProps;
    const gymName = shared.gym?.name ?? 'Forge Fitness';
    const gymLoc  = shared.gym?.location ?? 'Business Bay, Dubai';
    const flash   = shared.flash;

    const isActive = (id: string) => active === id;

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="brand">
                    <span className="brand-mark"><Icons.Logo /></span>
                    <span className="brand-wrap">
                        <span className="brand-name">Eloquent</span>
                        <span className="brand-product">Gym</span>
                    </span>
                </div>

                <div className="nav-scroll">
                    {NAV_GROUPS.map(g => (
                        <nav className="nav-group" key={g.group}>
                            <div className="nav-label">{g.group}</div>
                            {g.items.map(n => {
                                const Icon = n.icon;
                                return (
                                    <Link key={n.id} href={route(n.route)} className={`nav-item ${isActive(n.id) ? 'active' : ''}`}>
                                        <Icon />
                                        <span>{n.label}</span>
                                        {n.badge && <span className="badge">{n.badge}</span>}
                                        {n.live && <span className="live-dot" title="Live" />}
                                        {n.dot && <span className="warn-dot" title="Needs attention" />}
                                    </Link>
                                );
                            })}
                        </nav>
                    ))}
                </div>

                <div className="sidebar-foot">
                    <div className="gym-card">
                        <span className="gym-card-ic"><Icons.Pin /></span>
                        <div className="who">
                            <span className="name">{gymName}</span>
                            <span className="role">{gymLoc}</span>
                        </div>
                        <span className="chev"><Icons.ChevUpDown /></span>
                    </div>
                </div>
            </aside>

            <main className="main">
                <div className="topbar">
                    <div className="crumb">
                        <span>{gymName}</span>
                        <span className="sep">/</span>
                        <strong>{PAGE_TITLE[active] ?? 'Dashboard'}</strong>
                        {crumb && <><span className="sep">/</span><span className="muted">{crumb}</span></>}
                    </div>

                    <div className="search">
                        <Icons.Search />
                        <input placeholder="Search members, classes, invoices…" />
                        <span className="kbd">⌘K</span>
                    </div>

                    <button className="icon-btn" title="Notifications"><Icons.Bell /><span className="dot" /></button>
                    {action}
                    <button className="icon-btn" title="Logout" onClick={() => router.post(route('logout'))}><Icons.Logout /></button>
                </div>

                {flash?.success && <FlashBar kind="success">{flash.success}</FlashBar>}
                {flash?.error   && <FlashBar kind="error">{flash.error}</FlashBar>}

                {children}
            </main>
        </div>
    );
}

function FlashBar({ kind, children }: { kind: 'success' | 'error'; children: ReactNode }) {
    const col = kind === 'success' ? 'var(--accent)' : 'var(--danger)';
    const bg  = kind === 'success' ? 'var(--accent-soft)' : 'var(--danger-soft)';
    return (
        <div style={{
            margin: '14px 22px 0',
            padding: '10px 14px',
            border: `1px solid ${col}`,
            background: bg,
            color: col,
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
        }}>
            {children}
        </div>
    );
}
