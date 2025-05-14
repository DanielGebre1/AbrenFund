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
       Schema::create('proposal_media', function (Blueprint $table) {
    $table->id();
    $table->foreignId('proposal_id')->constrained()->onDelete('cascade');
    $table->string('path');
    $table->string('type'); // image, document, etc.
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposal_media');
    }
};
