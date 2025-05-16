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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->enum('type', ['project', 'challenge']);
        $table->string('title');
        $table->string('short_description');
        $table->text('full_description');
        $table->string('category');

         // Project-specific fields
        $table->decimal('funding_goal', 12, 2)->nullable();
        $table->date('end_date')->nullable();
        $table->enum('funding_type', ['all_or_nothing', 'keep_what_you_raise'])->nullable();

        // Challenge-specific fields
        $table->date('submission_deadline')->nullable();
        $table->decimal('reward_amount', 12, 2)->nullable();
        $table->date('expected_delivery_date')->nullable();
        $table->text('eligibility_criteria')->nullable();
        $table->text('project_scope')->nullable();
        $table->string('company_name')->nullable();
        $table->text('company_description')->nullable();
        $table->string('contact_email')->nullable();
        
        $table->string('thumbnail_path')->nullable();
        $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'active', 'completed'])->default('pending');
        $table->text('rejection_reason')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
