<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function index(): Response
    {
        $plans = Plan::withCount('members')->orderBy('price')->get()->map(fn ($p) => [
            'id'          => $p->id,
            'name'        => $p->name,
            'code'        => $p->code,
            'color'       => $p->color,
            'price'       => (float) $p->price,
            'cycle'       => $p->cycle,
            'description' => $p->description,
            'features'    => $p->features ?? [],
            'status'      => $p->status,
            'members'     => (int) $p->members_count,
        ]);

        return Inertia::render('Plans/Index', ['plans' => $plans]);
    }

    public function create(): Response
    {
        return Inertia::render('Plans/Form', ['plan' => null]);
    }

    public function store(Request $request)
    {
        Plan::create($this->validateData($request));
        return redirect()->route('plans.index')->with('success', 'Plan created.');
    }

    public function edit(Plan $plan): Response
    {
        return Inertia::render('Plans/Form', [
            'plan' => array_merge($plan->toArray(), ['features' => $plan->features ?? []]),
        ]);
    }

    public function update(Request $request, Plan $plan)
    {
        $plan->update($this->validateData($request));
        return redirect()->route('plans.index')->with('success', 'Plan updated.');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return redirect()->route('plans.index')->with('success', 'Plan deleted.');
    }

    private function validateData(Request $request): array
    {
        $data = $request->validate([
            'name'        => 'required|string|max:120',
            'code'        => 'required|string|max:8',
            'color'       => 'required|string|max:9',
            'price'       => 'required|numeric|min:0',
            'cycle'       => 'required|string|max:40',
            'description' => 'nullable|string|max:400',
            'features'    => 'array',
            'features.*'  => 'string|max:120',
            'status'      => 'required|in:live,popular,draft',
        ]);
        $data['features'] = array_values(array_filter($data['features'] ?? [], fn ($v) => trim($v) !== ''));
        return $data;
    }
}
