<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $table = 'equipment';

    protected $fillable = [
        'name', 'code', 'zone', 'category', 'status',
        'last_serviced_at', 'uses_lifetime', 'notes',
    ];

    protected $casts = [
        'last_serviced_at' => 'date',
        'uses_lifetime'    => 'integer',
    ];
}
