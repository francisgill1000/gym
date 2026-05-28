<?php

namespace App\Http\Controllers;

use App\Models\Trainer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrainerController extends Controller
{
    public function index(): Response
    {
        $trainers = Trainer::orderBy('name')->get();
        return Inertia::render('Trainers/Index', [
            'trainers' => $trainers,
            'onShift'  => $trainers->where('status', 'on-shift')->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Trainers/Form', ['trainer' => null]);
    }

    public function store(Request $request)
    {
        Trainer::create($this->validateData($request));
        return redirect()->route('trainers.index')->with('success', 'Trainer added.');
    }

    public function edit(Trainer $trainer): Response
    {
        return Inertia::render('Trainers/Form', ['trainer' => $trainer]);
    }

    public function update(Request $request, Trainer $trainer)
    {
        $trainer->update($this->validateData($request));
        return redirect()->route('trainers.index')->with('success', 'Trainer updated.');
    }

    public function destroy(Trainer $trainer)
    {
        $trainer->delete();
        return redirect()->route('trainers.index')->with('success', 'Trainer removed.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'name'       => 'required|string|max:120',
            'role'       => 'required|string|max:60',
            'specialty'  => 'nullable|string|max:120',
            'color'      => 'required|string|max:9',
            'clients'    => 'nullable|integer|min:0|max:9999',
            'classes_wk' => 'nullable|integer|min:0|max:99',
            'rating'     => 'nullable|numeric|min:0|max:5',
            'status'     => 'required|in:on-shift,off',
            'email'      => 'nullable|email|max:160',
            'phone'      => 'nullable|string|max:40',
        ]);
    }
}
