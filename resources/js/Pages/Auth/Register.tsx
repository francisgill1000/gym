import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };
    return (
        <GuestLayout>
            <Head title="Register" />
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Create your account</h2>
            <p style={{ margin: '6px 0 22px', color: 'var(--fg-muted)', fontSize: 13.5 }}>Run your gym on Eloquent Gym.</p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="field"><label>Name</label><input className="input" value={data.name} onChange={e => setData('name', e.target.value)} required autoFocus />{errors.name && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.name}</span>}</div>
                <div className="field"><label>Email</label><input type="email" className="input" value={data.email} onChange={e => setData('email', e.target.value)} required />{errors.email && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.email}</span>}</div>
                <div className="field"><label>Password</label><input type="password" className="input" value={data.password} onChange={e => setData('password', e.target.value)} required />{errors.password && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.password}</span>}</div>
                <div className="field"><label>Confirm password</label><input type="password" className="input" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required /></div>
                <button type="submit" className="btn-primary" disabled={processing} style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
                    {processing ? 'Creating…' : 'Create account'}
                </button>
                <div style={{ textAlign: 'right', fontSize: 12.5, marginTop: 4 }}>
                    <Link href={route('login')} style={{ color: 'var(--accent)' }}>Have an account? Sign in →</Link>
                </div>
            </form>
        </GuestLayout>
    );
}
