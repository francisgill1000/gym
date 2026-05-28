<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Checkin extends Model
{
    protected $fillable = [
        'member_id', 'member_name', 'plan_name',
        'gate', 'method', 'checked_in_at', 'checked_out_at',
    ];

    protected $casts = [
        'checked_in_at'  => 'datetime',
        'checked_out_at' => 'datetime',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
