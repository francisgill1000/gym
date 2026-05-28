<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentController extends Controller
{
    public const STATUSES = ['operational', 'maintenance', 'out-of-service'];
    public const CATEGORIES = ['Strength', 'Cardio', 'Combat', 'Other'];

    public function index(): Response
    {
        $units = Equipment::orderBy('zone')->orderBy('name')->get();
        return Inertia::render('Equipment/Index', [
            'units' => $units,
            'counts' => [
                'all'         => $units->count(),
                'operational' => $units->where('status', 'operational')->count(),
                'maintenance' => $units->where('status', 'maintenance')->count(),
                'out_of_service' => $units->where('status', 'out-of-service')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Equipment/Form', [
            'unit'       => null,
            'statuses'   => self::STATUSES,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(Request $request)
    {
        Equipment::create($this->validateData($request));
        return redirect()->route('equipment.index')->with('success', 'Equipment added.');
    }

    public function edit(Equipment $equipment): Response
    {
        return Inertia::render('Equipment/Form', [
            'unit'       => $equipment,
            'statuses'   => self::STATUSES,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(Request $request, Equipment $equipment)
    {
        $equipment->update($this->validateData($request, $equipment->id));
        return redirect()->route('equipment.index')->with('success', 'Equipment updated.');
    }

    public function destroy(Equipment $equipment)
    {
        $equipment->delete();
        return redirect()->route('equipment.index')->with('success', 'Equipment removed.');
    }

    private function validateData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name'             => 'required|string|max:120',
            'code'             => 'required|string|max:16|unique:equipment,code' . ($ignoreId ? ",{$ignoreId}" : ''),
            'zone'             => 'required|string|max:60',
            'category'         => 'required|in:' . implode(',', self::CATEGORIES),
            'status'           => 'required|in:' . implode(',', self::STATUSES),
            'last_serviced_at' => 'nullable|date',
            'uses_lifetime'    => 'nullable|integer|min:0',
            'notes'            => 'nullable|string|max:500',
        ]);
    }
}
