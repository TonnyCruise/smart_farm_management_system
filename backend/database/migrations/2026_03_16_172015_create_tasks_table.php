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
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        
        $table->foreignId('worker_id')->constrained()->onDelete('cascade');
        $table->foreignId('field_id')->constrained()->onDelete('cascade');
        $table->foreignId('planting_id')->nullable()->constrained()->onDelete('set null');
        
        $table->string('task_name');
        $table->date('task_date');
        $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
        $table->text('notes')->nullable();
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
