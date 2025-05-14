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
        if (Schema::hasTable('proposals')) {
            Schema::table('proposals', function (Blueprint $table) {
                // Check if column doesn't exist before adding
                if (!Schema::hasColumn('proposals', 'campaign_id')) {
                    $table->unsignedBigInteger('campaign_id')->after('id');
                    
                    // Add foreign key constraint only if campaigns table exists
                    if (Schema::hasTable('campaigns')) {
                        $table->foreign('campaign_id')
                              ->references('id')
                              ->on('campaigns')
                              ->onDelete('cascade');
                    }
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('proposals')) {
            Schema::table('proposals', function (Blueprint $table) {
                // Check if foreign key exists before dropping
                if (Schema::hasColumn('proposals', 'campaign_id')) {
                    $table->dropForeign(['campaign_id']);
                    $table->dropColumn('campaign_id');
                }
            });
        }
    }
};