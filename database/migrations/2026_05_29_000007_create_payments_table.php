<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->foreignId('member_id')->nullable()->constrained('members')->nullOnDelete();
            $table->string('member_name');                 // captured at time of sale
            $table->string('item');                        // "Monthly Unlimited", "PT Add-on x4"
            $table->decimal('amount', 10, 2);
            $table->string('method')->default('Card');     // Card · 4242 | Bank transfer | Cash
            $table->string('status')->default('paid');     // paid | pending | failed | refunded
            $table->date('issued_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
