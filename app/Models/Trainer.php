<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trainer extends Model
{
    protected $fillable = [
        'name', 'role', 'specialty', 'color',
        'clients', 'classes_wk', 'rating', 'status',
        'email', 'phone',
    ];

    protected $casts = [
        'rating'     => 'decimal:1',
        'clients'    => 'integer',
        'classes_wk' => 'integer',
    ];

    public function classes(): HasMany
    {
        return $this->hasMany(GymClass::class);
    }
}
