<?php

namespace App\Http\Controllers;

use App\Models\GymClass;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Plan;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function index(): Response
    {
        $revenue30 = collect(range(29, 0, -1))->map(function ($d) {
            $i = 29 - $d;
            return [
                'd'     => Carbon::now()->subDays($d)->format('M d'),
                'recur' => 6200 + $i * 35,
                'extra' => (int) (1500 + (sin($i / 2) * 800) + ($i * 60)),
            ];
        });

        $weekAttendance = [
            ['d' => 'Mon', 'n' => 312], ['d' => 'Tue', 'n' => 298], ['d' => 'Wed', 'n' => 341],
            ['d' => 'Thu', 'n' => 326], ['d' => 'Fri', 'n' => 358], ['d' => 'Sat', 'n' => 402], ['d' => 'Sun', 'n' => 271],
        ];
        $hourly = collect(range(6, 22))->map(fn ($h) => [
            'h' => sprintf('%02d', $h),
            'n' => match (true) {
                $h === 18 => 96, $h === 19 => 88, $h === 17 => 78,
                $h === 7  => 64, $h === 20 => 61, $h === 8  => 52,
                $h === 13 => 47, $h === 16 => 44, $h === 21 => 43,
                default => max(20, 60 - abs($h - 18) * 4),
            },
        ]);

        $mix = Plan::withCount('members')->get()->map(fn ($p) => [
            'label' => $p->name, 'n' => $p->members_count, 'color' => $p->color,
        ])->filter(fn ($r) => $r['n'] > 0)->values();

        $totalCap    = (int) GymClass::sum('capacity');
        $totalBooked = (int) GymClass::sum('booked');
        $fillRate    = $totalCap > 0 ? (int) round($totalBooked / $totalCap * 100) : 0;

        return Inertia::render('Reports/Index', [
            'kpis' => [
                'netRevenue30d' => (int) Payment::where('status', 'paid')->sum('amount'),
                'totalVisits'   => 9420,
                'retention'     => 91,
                'fillRate'      => $fillRate,
            ],
            'revenue30d'     => $revenue30,
            'weekAttendance' => $weekAttendance,
            'hourly'         => $hourly,
            'membershipMix'  => $mix,
        ]);
    }
}
