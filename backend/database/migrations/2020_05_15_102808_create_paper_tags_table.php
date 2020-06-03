<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaperTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('paper_tags', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('paper_id')->unsigned();
            $table->bigInteger('tag_id')->unsigned();
            $table->timestamps();
        });

        Schema::table('paper_tags', function (Blueprint $table) {
            $table->foreign('paper_id')->references('id')->on('papers');
            $table->foreign('tag_id')->references('id')->on('tags');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('paper_tags');
    }
}
