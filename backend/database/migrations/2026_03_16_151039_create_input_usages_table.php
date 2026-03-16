<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('input_usages', function (Blueprint $table) {
        $table->id();

        $table->foreignId('planting_id')->constrained()->onDelete('cascade');
        $table->foreignId('input_id')->constrained()->onDelete('cascade');

        $table->decimal('quantity_used', 10, 2);
        $table->date('usage_date');

        $table->text('notes')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('input_usages');
    }
};
