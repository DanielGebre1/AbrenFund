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
      Schema::create('proposals', function (Blueprint $table) {
    $table->id();
    $table->foreignId('campaign_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('description');
    $table->text('problem_statement');
    $table->text('proposed_solution');
    $table->text('budget_breakdown');
    $table->string('timeline');
    $table->text('expected_impact');
    $table->text('team_info');
    $table->string('status')->default('pending'); // pending, approved, rejected
    $table->text('feedback')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
