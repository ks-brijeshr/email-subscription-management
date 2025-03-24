<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->string('verification_token')->nullable()->after('status');
        });
    }

    public function down()
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropColumn('verification_token');
        });
    }
};
