<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GymClass extends Model
{
    protected $table = 'gym_classes';

    protected $fillable = [
        'name', 'type', 'trainer_id', 'room',
        'day_of_week', 'start_time', 'duration',
        'capacity', 'booked',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'duration'    => 'integer',
        'capacity'    => 'integer',
        'booked'      => 'integer',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function endTime(): string
    {
        [$h, $m] = explode(':', $this->start_time);
        $total = ((int) $h) * 60 + (int) $m + $this->duration;
        return sprintf('%02d:%02d', intdiv($total, 60), $total % 60);
    }
}
