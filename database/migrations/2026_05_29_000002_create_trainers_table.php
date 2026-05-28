<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->default('Trainer');
            $table->string('specialty')->nullable();
            $table->string('color', 9)->default('#00ffcc');
            $table->unsignedSmallInteger('clients')->default(0);
            $table->unsignedSmallInteger('classes_wk')->default(0);
            $table->decimal('rating', 3, 1)->default(0);
            $table->string('status')->default('on-shift');  // on-shift | off
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainers');
    }
};
