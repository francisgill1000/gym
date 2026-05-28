<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 8);
            $table->string('color', 9)->default('#00ffcc');
            $table->decimal('price', 10, 2);
            $table->string('cycle');                       // "per month", "per year", "10 credits"
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->string('status')->default('live');     // live | popular | draft
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
