<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(Request $request): Response
    {
        $q      = trim((string) $request->query('q', ''));
        $status = (string) $request->query('status', 'all');

        $members = Member::with('plan')
            ->when($q !== '', fn ($qb) => $qb->where(fn ($w) => $w
                ->where('name', 'like', "%{$q}%")
                ->orWhere('email', 'like', "%{$q}%")
                ->orWhere('phone', 'like', "%{$q}%")))
            ->when($status !== 'all', fn ($qb) => $qb->where('status', $status))
            ->orderByDesc('id')
            ->get()
            ->map(fn ($m) => $this->row($m));

        $counts = [
            'all'     => Member::count(),
            'active'  => Member::where('status', 'active')->count(),
            'trial'   => Member::where('status', 'trial')->count(),
            'frozen'  => Member::where('status', 'frozen')->count(),
            'expired' => Member::where('status', 'expired')->count(),
        ];

        return Inertia::render('Members/Index', [
            'members' => $members,
            'counts'  => $counts,
            'filters' => ['q' => $q, 'status' => $status],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Members/Form', [
            'member' => null,
            'plans'  => Plan::orderBy('price')->get(['id', 'name', 'price', 'cycle']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        Member::create($data);
        return redirect()->route('members.index')->with('success', 'Member added.');
    }

    public function show(Member $member): Response
    {
        $member->load('plan', 'payments', 'checkins');
        return Inertia::render('Members/Show', [
            'member' => array_merge($this->row($member), [
                'phone'             => $member->phone,
                'emergency_contact' => $member->emergency_contact,
                'access_method'     => $member->access_method,
                'tenure_months'     => round(Carbon::parse($member->joined_at)->diffInDays(now()) / 30, 1),
            ]),
            'payments' => $member->payments->map(fn ($p) => [
                'id'     => $p->invoice_no,
                'date'   => Carbon::parse($p->issued_at)->format('M d, Y'),
                'item'   => $p->item,
                'amount' => (float) $p->amount,
                'status' => $p->status,
            ]),
        ]);
    }

    public function edit(Member $member): Response
    {
        return Inertia::render('Members/Form', [
            'member' => array_merge($member->toArray(), [
                'joined_at' => Carbon::parse($member->joined_at)->toDateString(),
            ]),
            'plans'  => Plan::orderBy('price')->get(['id', 'name', 'price', 'cycle']),
        ]);
    }

    public function update(Request $request, Member $member)
    {
        $member->update($this->validateData($request, $member->id));
        return redirect()->route('members.show', $member)->with('success', 'Member updated.');
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return redirect()->route('members.index')->with('success', 'Member removed.');
    }

    private function validateData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name'              => 'required|string|max:120',
            'email'             => 'required|email|max:160|unique:members,email' . ($ignoreId ? ",{$ignoreId}" : ''),
            'phone'             => 'nullable|string|max:40',
            'plan_id'           => 'nullable|exists:plans,id',
            'status'            => 'required|in:active,trial,frozen,expired',
            'joined_at'         => 'required|date',
            'visits_30d'        => 'nullable|integer|min:0',
            'mrr'               => 'nullable|numeric|min:0',
            'emergency_contact' => 'nullable|string|max:60',
            'access_method'     => 'nullable|string|max:40',
        ]);
    }

    private function row(Member $m): array
    {
        return [
            'id'         => $m->id,
            'name'       => $m->name,
            'email'      => $m->email,
            'plan_id'    => $m->plan_id,
            'plan'       => $m->plan?->name ?? '—',
            'status'     => $m->status,
            'joined_at'  => Carbon::parse($m->joined_at)->format('M d, Y'),
            'last_visit' => $m->last_visit_at ? Carbon::parse($m->last_visit_at)->diffForHumans(['short' => true]) : '—',
            'visits_30d' => (int) $m->visits_30d,
            'mrr'        => (float) $m->mrr,
        ];
    }
}
