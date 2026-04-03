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
        Schema::table('input_usages', function (Blueprint $table) {
            $table->decimal('total_cost', 10, 2)->nullable()->after('quantity_used');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('input_usages', function (Blueprint $table) {
            $table->dropColumn('total_cost');
        });
    }
};
