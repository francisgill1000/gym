<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\CheckinController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\GymClassController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TrainerController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => auth()->check() ? redirect()->route('dashboard') : redirect()->route('login'));

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('members',   MemberController::class);
    Route::resource('plans',     PlanController::class)->except(['show']);
    Route::resource('trainers',  TrainerController::class)->except(['show']);
    Route::resource('equipment', EquipmentController::class)->except(['show'])->parameters(['equipment' => 'equipment']);

    Route::get('/schedule',                [GymClassController::class, 'index'])->name('schedule.index');
    Route::get('/schedule/create',         [GymClassController::class, 'create'])->name('schedule.create');
    Route::post('/schedule',               [GymClassController::class, 'store'])->name('schedule.store');
    Route::get('/schedule/{class}',        [GymClassController::class, 'show'])->name('schedule.show');
    Route::get('/schedule/{class}/edit',   [GymClassController::class, 'edit'])->name('schedule.edit');
    Route::put('/schedule/{class}',        [GymClassController::class, 'update'])->name('schedule.update');
    Route::delete('/schedule/{class}',     [GymClassController::class, 'destroy'])->name('schedule.destroy');

    Route::get('/checkin',  [CheckinController::class, 'index'])->name('checkin.index');
    Route::post('/checkin', [CheckinController::class, 'store'])->name('checkin.store');

    Route::get('/billing',                  [BillingController::class, 'index'])->name('billing.index');
    Route::get('/billing/create',           [BillingController::class, 'create'])->name('billing.create');
    Route::post('/billing',                 [BillingController::class, 'store'])->name('billing.store');
    Route::get('/billing/{payment}/edit',   [BillingController::class, 'edit'])->name('billing.edit');
    Route::put('/billing/{payment}',        [BillingController::class, 'update'])->name('billing.update');
    Route::delete('/billing/{payment}',     [BillingController::class, 'destroy'])->name('billing.destroy');

    Route::get('/reports',  [ReportsController::class, 'index'])->name('reports.index');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');

    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
