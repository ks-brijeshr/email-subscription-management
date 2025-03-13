<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('rate_limit_logs', function (Blueprint $table) {
            $table->dropColumn('enforced_by');
        });
    }

    public function down(): void
    {
        Schema::table('rate_limit_logs', function (Blueprint $table) {
            $table->string('enforced_by')->nullable();
        });
    }
};
