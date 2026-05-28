import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'manager@forgefitness.ae',
        password: 'password',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Sign in" />
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Welcome back</h2>
            <p style={{ margin: '6px 0 22px', color: 'var(--fg-muted)', fontSize: 13.5 }}>Sign in to Eloquent Gym.</p>

            {status && <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', color: 'var(--accent)', fontSize: 13 }}>{status}</div>}

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="field">
                    <label>Email</label>
                    <input type="email" className="input" value={data.email} onChange={e => setData('email', e.target.value)} required autoFocus />
                    {errors.email && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.email}</span>}
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="password" className="input" value={data.password} onChange={e => setData('password', e.target.value)} required />
                    {errors.password && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.password}</span>}
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--fg-muted)' }}>
                    <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
                    Keep me signed in
                </label>

                <button type="submit" className="btn-primary" disabled={processing} style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
                    {processing ? 'Signing in…' : 'Sign in'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12.5 }}>
                    {canResetPassword ? <Link href={route('password.request')} style={{ color: 'var(--fg-muted)' }}>Forgot password?</Link> : <span />}
                    <Link href={route('register')} style={{ color: 'var(--accent)' }}>Create account →</Link>
                </div>
            </form>
        </GuestLayout>
    );
}
