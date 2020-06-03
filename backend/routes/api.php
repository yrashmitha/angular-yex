<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/




Route::post('signup','AuthController@register');
Route::post('login','AuthController@login');
Route::get('logout','AuthController@logOut')->middleware('auth:api');
Route::post('detailsupdate','AuthController@detailsChange')->middleware('auth:api');
Route::post('changepass','AuthController@changePassword')->middleware('auth:api');




Route::post('upload','PaperController@upload')->middleware('auth:api');

Route::get('getpepers/{id}','PaperController@getPaper')->middleware('auth:api');
Route::get('gettags/{id}','PaperController@getTags')->middleware('auth:api');
Route::post('updatepaper','PaperController@UpdatePaper')->middleware('auth:api');
Route::delete('{id}','PaperController@destroy')->middleware('auth:api');
Route::delete('page/{id}','PaperController@destroyPage')->middleware('auth:api');
Route::get('offline/{id}','PaperController@turnOffline')->middleware('auth:api');
Route::get('online/{id}','PaperController@turnOnline')->middleware('auth:api');
Route::post('results','PaperController@getResults');




Route::get('avatar/{id}','AccountController@getAvatar')->middleware('auth:api');
Route::post('updateavatar','AccountController@updateAvatar')->middleware('auth:api');
Route::get('removeavatar/{id}','AccountController@removeAvatar')->middleware('auth:api');






Route::get('check','PaperController@check')->middleware('auth:api');

