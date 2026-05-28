<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'profile' => [
                'name'     => config('gym.name'),
                'location' => config('gym.location'),
                'timezone' => config('gym.timezone'),
                'capacity' => config('gym.capacity'),
                'currency' => config('gym.currency'),
                'email'    => 'hello@forgefitness.ae',
            ],
            'hours' => [
                'weekdays' => '06:00 – 23:00',
                'weekends' => '08:00 – 22:00',
            ],
        ]);
    }
}
