<?php

namespace App\Providers;

use App\Models\GymClass;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Bind {class} route param to GymClass model (avoids the reserved word `class`).
        Route::model('class', GymClass::class);
    }
}
