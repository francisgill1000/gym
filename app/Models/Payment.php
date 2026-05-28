<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'invoice_no', 'member_id', 'member_name',
        'item', 'amount', 'method', 'status', 'issued_at',
    ];

    protected $casts = [
        'issued_at' => 'date',
        'amount'    => 'decimal:2',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
