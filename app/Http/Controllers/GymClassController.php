<?php

namespace App\Http\Controllers;

use App\Models\GymClass;
use App\Models\Member;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GymClassController extends Controller
{
    public const TYPES = ['Strength', 'HIIT', 'Yoga', 'Cycle', 'Boxing'];
    public const TYPE_COLOR = [
        'Strength' => '#00ffcc', 'HIIT' => '#ff8aa3', 'Yoga' => '#a48cff',
        'Cycle' => '#6aa9ff', 'Boxing' => '#f0b65a',
    ];

    public function index(): Response
    {
        $classes = GymClass::with('trainer')->orderBy('day_of_week')->orderBy('start_time')->get()
            ->map(fn ($c) => DashboardController::classRow($c));

        $totalCap    = (int) GymClass::sum('capacity');
        $totalBooked = (int) GymClass::sum('booked');
        $fullCount   = GymClass::whereColumn('booked', '>=', 'capacity')->count();

        return Inertia::render('Schedule/Index', [
            'classes'    => $classes,
            'totalCap'   => $totalCap,
            'totalBooked'=> $totalBooked,
            'fullCount'  => $fullCount,
            'classTypes' => self::TYPE_COLOR,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Schedule/Form', [
            'class'    => null,
            'trainers' => Trainer::orderBy('name')->get(['id', 'name', 'role']),
            'types'    => self::TYPES,
        ]);
    }

    public function store(Request $request)
    {
        GymClass::create($this->validateData($request));
        return redirect()->route('schedule.index')->with('success', 'Class scheduled.');
    }

    public function show(GymClass $class): Response
    {
        $class->load('trainer');

        // Simple roster from active members (8 rows)
        $roster = Member::with('plan')->where('status', 'active')
            ->orderByDesc('visits_30d')->limit(min(8, $class->capacity))->get()
            ->map(fn ($m, $i) => [
                'id'     => $m->id,
                'name'   => $m->name,
                'plan'   => $m->plan?->name ?? '—',
                'status' => $i < $class->booked - 2 ? 'checked-in' : ($i < $class->booked ? 'booked' : 'waitlist'),
                'joined' => $i < $class->booked - 2 ? sprintf('%02d:%02d', random_int(6, 8), random_int(15, 45)) : '—',
            ]);

        return Inertia::render('Schedule/Show', [
            'class'      => DashboardController::classRow($class),
            'roster'     => $roster,
            'classTypes' => self::TYPE_COLOR,
        ]);
    }

    public function edit(GymClass $class): Response
    {
        return Inertia::render('Schedule/Form', [
            'class'    => $class,
            'trainers' => Trainer::orderBy('name')->get(['id', 'name', 'role']),
            'types'    => self::TYPES,
        ]);
    }

    public function update(Request $request, GymClass $class)
    {
        $class->update($this->validateData($request));
        return redirect()->route('schedule.index')->with('success', 'Class updated.');
    }

    public function destroy(GymClass $class)
    {
        $class->delete();
        return redirect()->route('schedule.index')->with('success', 'Class removed.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'name'        => 'required|string|max:120',
            'type'        => 'required|in:' . implode(',', self::TYPES),
            'trainer_id'  => 'nullable|exists:trainers,id',
            'room'        => 'required|string|max:60',
            'day_of_week' => 'required|integer|min:0|max:6',
            'start_time'  => 'required|regex:/^\d{2}:\d{2}$/',
            'duration'    => 'required|integer|min:5|max:300',
            'capacity'    => 'required|integer|min:1|max:200',
            'booked'      => 'nullable|integer|min:0',
        ]);
    }
}
