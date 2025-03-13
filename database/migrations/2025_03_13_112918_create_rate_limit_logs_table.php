<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('rate_limit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('ip_address');
            $table->string('endpoint');
            $table->integer('request_count');
            $table->string('enforced_by')->default('RateLimitMiddleware');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('rate_limit_logs');
    }
};
