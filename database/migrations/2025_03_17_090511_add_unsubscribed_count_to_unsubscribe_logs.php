<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('unsubscribe_logs', function (Blueprint $table) {
            $table->integer('unsubscribed_count')->default(0); 
            $table->date('recorded_date')->default(now());
        });
    }

    public function down()
    {
        Schema::table('unsubscribe_logs', function (Blueprint $table) {
            $table->dropColumn(['unsubscribed_count', 'recorded_date']);
        });
    }
};
