import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const submit: FormEventHandler = (e) => { e.preventDefault(); post(route('password.email')); };
    return (
        <GuestLayout>
            <Head title="Forgot password" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Reset your password</h2>
            <p style={{ margin: '6px 0 22px', color: 'var(--fg-muted)', fontSize: 13 }}>Enter your email and we'll send a reset link.</p>
            {status && <div style={{ marginBottom: 12, color: 'var(--accent)', fontSize: 13 }}>{status}</div>}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="field"><label>Email</label><input type="email" className="input" value={data.email} onChange={e => setData('email', e.target.value)} required autoFocus />{errors.email && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.email}</span>}</div>
                <button type="submit" className="btn-primary" disabled={processing} style={{ width: '100%', justifyContent: 'center' }}>{processing ? 'Sending…' : 'Send reset link'}</button>
            </form>
        </GuestLayout>
    );
}
