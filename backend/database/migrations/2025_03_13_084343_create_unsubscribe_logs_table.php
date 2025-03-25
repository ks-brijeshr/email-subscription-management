<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('unsubscribe_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('list_id')->constrained('subscription_lists')->onDelete('cascade');
            $table->foreignId('subscriber_id')->constrained('subscribers')->onDelete('cascade');
            $table->timestamp('unsubscribed_at')->useCurrent();
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('unsubscribe_logs');
    }
};
