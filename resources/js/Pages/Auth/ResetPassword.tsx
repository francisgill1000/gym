import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token, email, password: '', password_confirmation: '',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') });
    };
    return (
        <GuestLayout>
            <Head title="Reset password" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Set a new password</h2>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
                <div className="field"><label>Email</label><input type="email" className="input" value={data.email} onChange={e => setData('email', e.target.value)} required /></div>
                <div className="field"><label>New password</label><input type="password" className="input" value={data.password} onChange={e => setData('password', e.target.value)} required />{errors.password && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.password}</span>}</div>
                <div className="field"><label>Confirm password</label><input type="password" className="input" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required /></div>
                <button type="submit" className="btn-primary" disabled={processing} style={{ width: '100%', justifyContent: 'center' }}>{processing ? 'Saving…' : 'Reset password'}</button>
            </form>
        </GuestLayout>
    );
}
