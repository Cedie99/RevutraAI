<?php

use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ChatController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/upload', [ReviewController::class, 'upload']);
Route::post('/comprehend', [ReviewController::class, 'comprehendDocument']);
Route::post('/download-review', [ReviewController::class, 'downloadReview']);
Route::post('/chat', [ChatController::class, 'ask']);




