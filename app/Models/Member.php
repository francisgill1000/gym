<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'plan_id', 'status',
        'joined_at', 'last_visit_at', 'visits_30d', 'mrr',
        'emergency_contact', 'access_method',
    ];

    protected $casts = [
        'joined_at'      => 'date',
        'last_visit_at'  => 'datetime',
        'mrr'            => 'decimal:2',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function checkins(): HasMany
    {
        return $this->hasMany(Checkin::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
