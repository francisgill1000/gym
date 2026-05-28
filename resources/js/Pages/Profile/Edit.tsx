import GymLayout from '@/Layouts/GymLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Icons } from '@/Components/GymIcons';

export default function ProfileEdit() {
    const { auth } = usePage<any>().props;
    const user = auth?.user ?? {};
    const info = useForm({ name: user.name ?? '', email: user.email ?? '' });
    const pwd  = useForm({ current_password: '', password: '', password_confirmation: '' });
    const del  = useForm({ password: '' });

    const updateInfo: FormEventHandler = (e) => { e.preventDefault(); info.patch(route('profile.update')); };
    const updatePwd:  FormEventHandler = (e) => { e.preventDefault(); pwd.put(route('password.update'),  { onSuccess: () => pwd.reset() }); };
    const destroy:    FormEventHandler = (e) => { e.preventDefault(); if (confirm('Delete account permanently?')) del.delete(route('profile.destroy')); };

    return (
        <GymLayout active="settings" crumb="Profile">
            <Head title="Profile" />
            <div className="page">
                <div className="page-head">
                    <div className="row gap-3">
                        <Link href={route('dashboard')} className="icon-btn"><Icons.Back /></Link>
                        <div>
                            <h1 className="page-title">Your profile</h1>
                            <p className="page-sub">Update your account info, password, or delete your account.</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
                    <form onSubmit={updateInfo} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <h3 className="card-title">Account info</h3>
                        <div className="field"><label>Name</label><input className="input" value={info.data.name} onChange={e => info.setData('name', e.target.value)} required />{info.errors.name && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{info.errors.name}</span>}</div>
                        <div className="field"><label>Email</label><input type="email" className="input" value={info.data.email} onChange={e => info.setData('email', e.target.value)} required />{info.errors.email && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{info.errors.email}</span>}</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn-primary" disabled={info.processing}><Icons.Check /> Save</button></div>
                    </form>

                    <form onSubmit={updatePwd} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <h3 className="card-title">Change password</h3>
                        <div className="field"><label>Current password</label><input type="password" className="input" value={pwd.data.current_password} onChange={e => pwd.setData('current_password', e.target.value)} required />{pwd.errors.current_password && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{pwd.errors.current_password}</span>}</div>
                        <div className="field-row">
                            <div className="field"><label>New password</label><input type="password" className="input" value={pwd.data.password} onChange={e => pwd.setData('password', e.target.value)} required />{pwd.errors.password && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{pwd.errors.password}</span>}</div>
                            <div className="field"><label>Confirm</label><input type="password" className="input" value={pwd.data.password_confirmation} onChange={e => pwd.setData('password_confirmation', e.target.value)} required /></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn-primary" disabled={pwd.processing}><Icons.Check /> Update password</button></div>
                    </form>

                    <form onSubmit={destroy} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14, borderColor: 'var(--danger)' }}>
                        <h3 className="card-title" style={{ color: 'var(--danger)' }}>Delete account</h3>
                        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg-muted)' }}>This permanently deletes your account and all associated data. There is no undo.</p>
                        <div className="field"><label>Confirm with password</label><input type="password" className="input" value={del.data.password} onChange={e => del.setData('password', e.target.value)} required />{del.errors.password && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{del.errors.password}</span>}</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn-ghost" style={{ color: 'var(--danger)' }} disabled={del.processing}><Icons.Trash /> Delete account</button></div>
                    </form>
                </div>
            </div>
        </GymLayout>
    );
}
