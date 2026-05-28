import { Head } from '@inertiajs/react';
import { useState } from 'react';
import GymLayout from '@/Layouts/GymLayout';
import { Icons } from '@/Components/GymIcons';

type Props = {
    profile: { name: string; location: string; timezone: string; capacity: number; currency: string; email: string };
    hours: { weekdays: string; weekends: string };
};

const NAV: [string, string][] = [
    ['general', 'General'], ['hours', 'Hours & access'], ['billing', 'Billing'],
    ['notifications', 'Notifications'], ['team', 'Team & roles'],
];

export default function SettingsIndex({ profile, hours }: Props) {
    const [tab, setTab] = useState<string>('general');
    const [toggles, setToggles] = useState({ renew: true, waitlist: true, sms: false, daypass: true, latefee: false });
    const T = ({ k, title, desc }: { k: keyof typeof toggles; title: string; desc: string }) => (
        <div className="set-row">
            <div><div className="st">{title}</div><div className="sd">{desc}</div></div>
            <button className={`switch ${toggles[k] ? 'on' : ''}`} onClick={() => setToggles(s => ({ ...s, [k]: !s[k] }))}><i /></button>
        </div>
    );

    return (
        <GymLayout active="settings" action={
            <>
                <button className="btn-ghost">Discard</button>
                <button className="btn-primary"><Icons.Check /> Save changes</button>
            </>
        }>
            <Head title="Settings" />
            <div className="page">
                <div className="page-head">
                    <div>
                        <h1 className="page-title">Settings</h1>
                        <p className="page-sub">Configure {profile.name} on Eloquent Gym.</p>
                    </div>
                </div>

                <div className="settings-grid">
                    <div className="settings-nav">
                        {NAV.map(([id, label]) => (
                            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {tab === 'general' && (
                            <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 className="card-title">Gym profile</h3>
                                <div className="field"><label>Gym name</label><input className="input" defaultValue={profile.name} /></div>
                                <div className="field-row">
                                    <div className="field"><label>Location</label><input className="input" defaultValue={profile.location} /></div>
                                    <div className="field"><label>Timezone</label><input className="input" defaultValue={profile.timezone} /></div>
                                </div>
                                <div className="field-row">
                                    <div className="field"><label>Capacity</label><input className="input" defaultValue={profile.capacity} /></div>
                                    <div className="field"><label>Currency</label><input className="input" defaultValue={profile.currency} /></div>
                                </div>
                                <div className="field"><label>Contact email</label><input className="input" defaultValue={profile.email} /></div>
                            </div>
                        )}

                        {tab === 'hours' && (
                            <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 className="card-title">Opening hours &amp; access</h3>
                                <div className="field-row">
                                    <div className="field"><label>Weekdays</label><input className="input" defaultValue={hours.weekdays} /></div>
                                    <div className="field"><label>Weekends</label><input className="input" defaultValue={hours.weekends} /></div>
                                </div>
                                <T k="daypass" title="Allow day passes" desc="Sell single-visit passes at the front desk." />
                                <T k="latefee" title="Off-peak enforcement" desc="Block off-peak members outside 10:00–16:00." />
                            </div>
                        )}

                        {tab === 'billing' && (
                            <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 className="card-title">Billing</h3>
                                <div className="field"><label>Billing day</label><input className="input" defaultValue="1st of each month" /></div>
                                <div className="field"><label>Payment provider</label><input className="input" defaultValue="Eloquent Billing · Stripe" /><span className="hint">Connected · last sync 4m ago</span></div>
                                <T k="renew" title="Auto-renew memberships" desc="Charge cards automatically on the billing day." />
                                <T k="latefee" title="Late payment fee" desc="Apply AED 25 after 5 days overdue." />
                            </div>
                        )}

                        {tab === 'notifications' && (
                            <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <h3 className="card-title" style={{ marginBottom: 8 }}>Notifications</h3>
                                <T k="renew" title="Renewal reminders" desc="Email members 3 days before renewal." />
                                <T k="waitlist" title="Waitlist alerts" desc="Notify members when a class spot opens." />
                                <T k="sms" title="SMS check-in receipts" desc="Text a confirmation on every check-in." />
                                <T k="daypass" title="Failed payment alerts" desc="Alert staff when a charge fails." />
                            </div>
                        )}

                        {tab === 'team' && (
                            <div className="card">
                                <div className="card-head">
                                    <h3 className="card-title">Team &amp; roles</h3>
                                    <button className="btn-primary"><Icons.Plus /> Invite</button>
                                </div>
                                <table className="table">
                                    <thead><tr><th>Member</th><th>Role</th><th>Access</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {[['Reception Desk', 'Front desk', 'Check-in, day passes'],
                                          ['Marcus Reyes',    'Manager',    'Full access'],
                                          ['Aisha Noor',      'Trainer',    'Schedule, rosters']].map((r, i) => (
                                            <tr key={i}>
                                                <td>{r[0]}</td>
                                                <td>{r[1]}</td>
                                                <td className="muted">{r[2]}</td>
                                                <td><span className="tag active">active</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GymLayout>
    );
}
