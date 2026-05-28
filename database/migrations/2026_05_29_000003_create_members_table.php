<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->foreignId('plan_id')->nullable()->constrained('plans')->nullOnDelete();
            $table->string('status')->default('active');   // active | trial | frozen | expired
            $table->date('joined_at');
            $table->timestamp('last_visit_at')->nullable();
            $table->unsignedSmallInteger('visits_30d')->default(0);
            $table->decimal('mrr', 10, 2)->default(0);
            $table->string('emergency_contact')->nullable();
            $table->string('access_method')->default('App QR');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
