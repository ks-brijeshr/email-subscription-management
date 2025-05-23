<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscription_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); //Owner and who created the Subscription List
            $table->string('name');
            $table->boolean('is_verified')->default(false); // Email verification required For Owners Who created Subscription list
            $table->boolean('allow_business_email_only')->default(true);
            $table->boolean('block_temporary_email')->default(true);
            $table->boolean('require_email_verification')->default(true);
            $table->boolean('check_domain_existence')->default(true);
            $table->boolean('verify_dns_records')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_lists');
    }
};
