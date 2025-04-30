<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            // Check if table exists first
            if (!Schema::hasTable('password_reset_tokens')) {
                Schema::create('password_reset_tokens', function (Blueprint $table) {
                    $table->id();
                    $table->string('email')->index();
                    $table->string('token');
                    $table->timestamp('expires_at')->nullable();
                    $table->timestamps();
                });
                return;
            }

            // Safely modify existing table
            $this->modifyExistingTable($table);
        });
    }

    protected function modifyExistingTable(Blueprint $table): void
    {
        // Add email column if missing
        if (!Schema::hasColumn('password_reset_tokens', 'email')) {
            $table->string('email')->after('id')->index();
        }

        // Add expires_at if missing
        if (!Schema::hasColumn('password_reset_tokens', 'expires_at')) {
            $table->timestamp('expires_at')->nullable()->after('token');
        }

        // Ensure timestamps exist
        if (!Schema::hasColumn('password_reset_tokens', 'created_at')) {
            $table->timestamp('created_at')->nullable();
        }

        if (!Schema::hasColumn('password_reset_tokens', 'updated_at')) {
            $table->timestamp('updated_at')->nullable();
        }

        // Safely remove user_id if exists
        if (Schema::hasColumn('password_reset_tokens', 'user_id')) {
            $table->dropConstrainedForeignId('user_id');
        }
    }

    public function down(): void
    {
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            // Only modify if table exists
            if (!Schema::hasTable('password_reset_tokens')) {
                return;
            }

            // Revert changes
            if (!Schema::hasColumn('password_reset_tokens', 'user_id')) {
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            }

            $columnsToDrop = ['email', 'expires_at', 'created_at', 'updated_at'];
            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('password_reset_tokens', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};