<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('email_blacklists', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->text('reason')->nullable();
            $table->foreignId('blacklisted_by')->constrained('users')->onDelete('cascade'); // Who blacklisted the email

            // Subscription List Foreign Key (Correctly referenced)
            $table->foreignId('subscription_list_id')
                  ->constrained('subscription_lists')  // Linking with subscription_lists table
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('email_blacklists');
    }
};
