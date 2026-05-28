<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name', 'code', 'color', 'price', 'cycle', 'description', 'features', 'status',
    ];

    protected $casts = [
        'price'    => 'decimal:2',
        'features' => 'array',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    protected function membersCountCached(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->members()->count()
        );
    }
}
