import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});
    const submit: FormEventHandler = (e) => { e.preventDefault(); post(route('verification.send')); };
    return (
        <GuestLayout>
            <Head title="Verify email" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Verify your email</h2>
            <p style={{ margin: '6px 0 18px', color: 'var(--fg-muted)', fontSize: 13 }}>We sent a verification link. Click it to continue.</p>
            {status === 'verification-link-sent' && <div style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 12 }}>A new verification link has been sent.</div>}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button type="submit" className="btn-primary" disabled={processing} style={{ width: '100%', justifyContent: 'center' }}>{processing ? 'Sending…' : 'Resend email'}</button>
                <Link href={route('logout')} method="post" as="button" className="btn-ghost" style={{ justifyContent: 'center' }}>Log out</Link>
            </form>
        </GuestLayout>
    );
}
