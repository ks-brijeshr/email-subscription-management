<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ip_monitoring_and_blocking', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address', 45)->unique();
            $table->text('reason')->nullable();
            $table->timestamp('blocked_at')->useCurrent();
            $table->unsignedBigInteger('blocked_by');
            $table->foreign('blocked_by')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ip_monitoring_and_blocking');
    }
};
