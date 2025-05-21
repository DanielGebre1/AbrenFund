<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddChangesStatusAndRenameFeedbackColumn extends Migration
{
    public function up()
    {
        // SQLite doesn't support modifying ENUM columns directly, so we need to drop and recreate the column
        Schema::table('campaigns', function (Blueprint $table) {
            // Rename rejection_reason to feedback
            $table->renameColumn('rejection_reason', 'feedback');
            
            // Drop the existing status column
            $table->dropColumn('status');
        });

        Schema::table('campaigns', function (Blueprint $table) {
            // Recreate status column with updated ENUM
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'changes', 'active', 'completed'])
                  ->default('pending')
                  ->after('type');
        });
    }

    public function down()
    {
        Schema::table('campaigns', function (Blueprint $table) {
            // Revert feedback to rejection_reason
            $table->renameColumn('feedback', 'rejection_reason');
            
            // Drop the modified status column
            $table->dropColumn('status');
        });

        Schema::table('campaigns', function (Blueprint $table) {
            // Restore original status ENUM
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'active', 'completed'])
                  ->default('pending')
                  ->after('type');
        });
    }
}