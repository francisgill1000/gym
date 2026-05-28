import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Icons } from '@/Components/GymIcons';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: 24,
            background: `
                radial-gradient(1400px 800px at 78% -12%, rgba(0,255,204,0.10), transparent 55%),
                radial-gradient(1000px 700px at -10% 110%, rgba(0,255,204,0.06), transparent 55%),
                var(--canvas)`,
        }}>
            <div style={{ width: '100%', maxWidth: 440 }}>
                <Link href="/" style={{
                    display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
                    marginBottom: 28, color: 'var(--accent)', textDecoration: 'none',
                }}>
                    <span className="brand-mark" style={{ width: 44, height: 44 }}><Icons.Logo /></span>
                    <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)' }}>Eloquent <span style={{ color: 'var(--accent)' }}>Gym</span></span>
                </Link>

                <div className="card" style={{ padding: '30px 30px 26px' }}>
                    {children}
                </div>

                <div style={{ textAlign: 'center', marginTop: 18, color: 'var(--fg-dim)', fontSize: 12 }}>
                    Eloquent Gym · a product of Eloquent FZE LLC
                </div>
            </div>
        </div>
    );
}
