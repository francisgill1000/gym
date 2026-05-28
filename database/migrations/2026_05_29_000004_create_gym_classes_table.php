<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gym_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');                        // Strength, HIIT, Yoga, Cycle, Boxing
            $table->foreignId('trainer_id')->nullable()->constrained('trainers')->nullOnDelete();
            $table->string('room');
            $table->unsignedTinyInteger('day_of_week');    // 0=Mon … 6=Sun
            $table->string('start_time', 5);               // "HH:MM"
            $table->unsignedSmallInteger('duration');      // minutes
            $table->unsignedSmallInteger('capacity');
            $table->unsignedSmallInteger('booked')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gym_classes');
    }
};
