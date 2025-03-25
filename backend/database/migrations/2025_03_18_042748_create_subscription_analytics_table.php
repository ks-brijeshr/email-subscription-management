<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('subscription_analytics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('list_id');
            $table->date('recorded_date')->default(now());
            $table->integer('new_subscribers')->default(0);
            $table->timestamps();

            $table->foreign('list_id')->references('id')->on('subscription_lists')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('subscription_analytics');
    }
};
