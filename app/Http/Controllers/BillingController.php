<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public const STATUSES = ['paid', 'pending', 'failed', 'refunded'];
    public const METHODS  = ['Card', 'Bank transfer', 'Cash', 'Other'];

    public function index(Request $request): Response
    {
        $status = (string) $request->query('status', 'all');

        $payments = Payment::with('member')
            ->when($status !== 'all', fn ($qb) => $qb->where('status', $status))
            ->orderByDesc('issued_at')->orderByDesc('id')->get()
            ->map(fn ($p) => $this->row($p));

        $sumPaid    = (int) Payment::where('status', 'paid')->sum('amount');
        $countPaid  = Payment::where('status', 'paid')->count();
        $countFail  = Payment::where('status', 'failed')->count();
        $sumRefund  = (int) Payment::where('status', 'refunded')->sum('amount');

        return Inertia::render('Billing/Index', [
            'payments' => $payments,
            'sums'     => ['paid' => $sumPaid, 'refund' => $sumRefund],
            'counts'   => ['paid' => $countPaid, 'failed' => $countFail],
            'filters'  => ['status' => $status],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Billing/Form', [
            'payment' => null,
            'members' => Member::orderBy('name')->get(['id', 'name']),
            'statuses' => self::STATUSES,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $member = isset($data['member_id']) ? Member::find($data['member_id']) : null;
        $data['member_name'] = $member?->name ?? ($data['member_name'] ?? 'Walk-in');
        $data['invoice_no']  = 'INV-' . str_pad((string) (Payment::max('id') + 8842), 4, '0', STR_PAD_LEFT);
        Payment::create($data);
        return redirect()->route('billing.index')->with('success', 'Invoice recorded.');
    }

    public function edit(Payment $payment): Response
    {
        return Inertia::render('Billing/Form', [
            'payment'  => array_merge($payment->toArray(), [
                'issued_at' => Carbon::parse($payment->issued_at)->toDateString(),
            ]),
            'members'  => Member::orderBy('name')->get(['id', 'name']),
            'statuses' => self::STATUSES,
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $payment->update($this->validateData($request));
        return redirect()->route('billing.index')->with('success', 'Invoice updated.');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return redirect()->route('billing.index')->with('success', 'Invoice deleted.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'member_id'   => 'nullable|exists:members,id',
            'member_name' => 'nullable|string|max:120',
            'item'        => 'required|string|max:120',
            'amount'      => 'required|numeric|min:0',
            'method'      => 'required|string|max:40',
            'status'      => 'required|in:' . implode(',', self::STATUSES),
            'issued_at'   => 'required|date',
        ]);
    }

    private function row(Payment $p): array
    {
        return [
            'id'         => $p->invoice_no,
            'pk'         => $p->id,
            'date'       => Carbon::parse($p->issued_at)->format('M d, Y'),
            'member_id'  => $p->member_id,
            'member'     => $p->member_name,
            'item'       => $p->item,
            'amount'     => (float) $p->amount,
            'method'     => $p->method,
            'status'     => $p->status,
        ];
    }
}
