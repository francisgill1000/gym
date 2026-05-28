<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 16)->unique();
            $table->string('zone');
            $table->string('category');                    // Strength | Cardio | Combat | Other
            $table->string('status')->default('operational'); // operational | maintenance | out-of-service
            $table->date('last_serviced_at')->nullable();
            $table->unsignedInteger('uses_lifetime')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
