<?php

namespace App\Http\Controllers;

use App\Models\Checkin;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class CheckinController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::now('Asia/Dubai')->toDateString();
        $list = Checkin::with('member.plan')
            ->orderByDesc('checked_in_at')->limit(30)->get()
            ->map(fn ($c) => [
                'id'     => $c->id,
                'name'   => $c->member_name,
                'plan'   => $c->plan_name ?? $c->member?->plan?->name ?? '—',
                'gate'   => $c->gate,
                'method' => $c->method,
                'time'   => Carbon::parse($c->checked_in_at)->format('H:i'),
            ]);

        $todayCount = Checkin::whereDate('checked_in_at', $today)->count();
        $dayPasses  = Checkin::whereDate('checked_in_at', $today)->where('plan_name', 'Day Pass')->count();

        return Inertia::render('Checkin/Index', [
            'checkins'      => $list,
            'todayCount'    => $todayCount,
            'dayPasses'     => $dayPasses,
            'currentInside' => 128,
            'occupancy'     => 71,
            'capacity'      => config('gym.capacity'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'member_id' => 'nullable|exists:members,id',
            'name'      => 'nullable|string|max:120',
            'gate'      => 'nullable|string|max:60',
            'method'    => 'nullable|string|max:40',
        ]);

        $member = isset($data['member_id']) ? Member::with('plan')->find($data['member_id']) : null;

        Checkin::create([
            'member_id'     => $member?->id,
            'member_name'   => $member?->name ?? ($data['name'] ?? 'Walk-in'),
            'plan_name'     => $member?->plan?->name ?? 'Day Pass',
            'gate'          => $data['gate']   ?? 'Front desk',
            'method'        => $data['method'] ?? 'Front desk',
            'checked_in_at' => Carbon::now('Asia/Dubai'),
        ]);

        if ($member) {
            $member->update(['last_visit_at' => Carbon::now('Asia/Dubai')]);
        }

        return back()->with('success', 'Checked in.');
    }
}
