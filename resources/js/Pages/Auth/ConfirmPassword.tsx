import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), { onFinish: () => reset('password') });
    };
    return (
        <GuestLayout>
            <Head title="Confirm password" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Confirm your password</h2>
            <p style={{ margin: '6px 0 22px', color: 'var(--fg-muted)', fontSize: 13 }}>For security, please confirm before continuing.</p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="field"><label>Password</label><input type="password" className="input" value={data.password} onChange={e => setData('password', e.target.value)} required autoFocus />{errors.password && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.password}</span>}</div>
                <button type="submit" className="btn-primary" disabled={processing} style={{ width: '100%', justifyContent: 'center' }}>{processing ? 'Confirming…' : 'Confirm'}</button>
            </form>
        </GuestLayout>
    );
}
