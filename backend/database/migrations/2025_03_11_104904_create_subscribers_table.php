<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up()
    {
        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('list_id')->constrained('subscription_lists')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('email');
            $table->json('metadata')->nullable();
            $table->enum('status', ['active', 'inactive', 'blacklisted'])->default('inactive');
            $table->timestamps();

            // composite unique index on list_id and email
            $table->unique(['list_id', 'email'], 'subscribers_list_id_email_unique');
        });
    }

    public function down()
    {
        Schema::dropIfExists('subscribers');
    }
};
