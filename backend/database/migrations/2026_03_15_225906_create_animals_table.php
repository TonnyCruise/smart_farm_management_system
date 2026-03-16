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
    Schema::create('animals', function (Blueprint $table) {
        $table->id();
        $table->string('animal_tag')->unique();
        $table->string('species');
        $table->string('breed');
        $table->string('gender');
        $table->date('birth_date');
        $table->string('health_status')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};
