<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('list_id')->constrained('subscription_lists')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('email')->unique();
            $table->json('metadata')->nullable();
            $table->enum('status', ['active', 'inactive', 'blacklisted'])->default('inactive');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('subscribers');
    }
};;
