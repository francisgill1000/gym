import { ReactNode } from 'react';

type Props = { className?: string };

const stroke = (children: ReactNode, w = 1.6) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

export const Icons = {
    Dash:       () => stroke(<><rect x="3.5" y="3.5" width="7" height="9" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.5"/><rect x="3.5" y="15.5" width="7" height="5" rx="1.5"/><rect x="13.5" y="11.5" width="7" height="9" rx="1.5"/></>),
    Members:    () => stroke(<><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="7" r="2.5"/><path d="M15.5 13.5c2.6 0 5 1.9 5 5"/></>),
    Checkin:    () => stroke(<><rect x="3.5" y="4" width="6" height="6" rx="1"/><rect x="3.5" y="14" width="6" height="6" rx="1"/><rect x="14.5" y="4" width="6" height="6" rx="1"/><path d="M14.5 14.5h3v3M20.5 17.5v3M17.5 20.5h-1"/></>),
    Schedule:   () => stroke(<><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></>),
    Trainers:   () => stroke(<><circle cx="12" cy="6.5" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><path d="M19 8.5a2.2 2.2 0 1 0 0-4.4"/></>),
    Plans:      () => stroke(<><path d="M3 9.5l9-5 9 5v5l-9 5-9-5z"/><path d="M3 9.5l9 5 9-5M12 14.5V20"/></>),
    Billing:    () => stroke(<><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/></>),
    Equipment:  () => stroke(<><path d="M6.5 9v6M17.5 9v6M3.5 10.5v3M20.5 10.5v3M6.5 12h11"/></>, 1.7),
    Reports:    () => stroke(<><path d="M4 19h17M5 16V9M10 16v-4M15 16V6M20 16v-7"/></>),
    Settings:   () => stroke(<><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7L5.6 5.6"/></>),
    Search:     () => stroke(<><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.5-3.5"/></>),
    Bell:       () => stroke(<><path d="M6 17h12l-1.3-2.2A2 2 0 0 1 16.5 14V10a4.5 4.5 0 0 0-9 0v4a2 2 0 0 1-.2.8L6 17z"/><path d="M10 20a2 2 0 0 0 4 0"/></>),
    Plus:       () => stroke(<path d="M12 5v14M5 12h14"/>, 1.8),
    Download:   () => stroke(<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>),
    Filter:     () => stroke(<path d="M4 5h16l-6 8v6l-4-2v-4z"/>),
    Chev:       () => stroke(<path d="M9 18l6-6-6-6"/>),
    Back:       () => stroke(<path d="M15 18l-6-6 6-6"/>, 1.7),
    ChevUpDown: () => stroke(<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>, 1.5),
    More:       () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/></svg>,
    Alert:      () => stroke(<><path d="M12 4l10 17H2L12 4z"/><path d="M12 10v5M12 18v.5"/></>),
    Check:      () => stroke(<path d="M5 12l4 4 10-10"/>, 2),
    Clock:      () => stroke(<><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>),
    Pin:        () => stroke(<><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></>),
    Bolt:       () => stroke(<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>),
    Dumbbell:   () => stroke(<path d="M6.5 9v6M17.5 9v6M3.5 10.5v3M20.5 10.5v3M6.5 12h11"/>, 1.7),
    Flame:      () => stroke(<path d="M12 3c.5 3-1.5 4.5-3 6.5C7.4 11.6 7 13 7 14.5A5 5 0 0 0 17 15c0-2-1-3.7-2.2-5C13.3 8.4 12.7 6 12 3z"/>),
    User:       () => stroke(<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></>),
    Star:       () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.6 6 6.4.6-4.9 4.4 1.5 6.5L12 17l-5.6 3.5 1.5-6.5L3 9.6 9.4 9z"/></svg>,
    Card:       () => stroke(<><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/></>),
    ArrowUp:    () => <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3-3 3 3"/></svg>,
    ArrowDown:  () => <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5l3 3 3-3"/></svg>,
    Logo:       () => <svg viewBox="0 0 24 24" fill="none"><path d="M6.5 8.5v7M17.5 8.5v7M3.5 10v4M20.5 10v4M6.5 12h11" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Trash:      () => stroke(<><path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"/></>),
    Edit:       () => stroke(<><path d="M4 20l4-1L20 7l-3-3L5 16l-1 4z"/></>),
    Logout:     () => stroke(<><path d="M9 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M16 17l5-5-5-5M21 12H9"/></>),
};

export const CLASS_ICON: Record<string, () => ReactNode> = {
    Strength: Icons.Dumbbell,
    HIIT: Icons.Flame,
    Yoga: Icons.User,
    Cycle: Icons.Bolt,
    Boxing: Icons.Star,
};
