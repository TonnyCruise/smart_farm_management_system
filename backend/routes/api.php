<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\AnimalHealthRecordController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\PlantingController;
use App\Http\Controllers\HarvestController;
use App\Http\Controllers\InputController;



Route::get('/test', function () {
    return response()->json([
        'message' => 'API working'
    ]);
});
// Animal management API

Route::get('/animals', [AnimalController::class, 'index']);
Route::post('/animals', [AnimalController::class, 'store']);
Route::get('/animals/{id}', [AnimalController::class, 'show']);
Route::put('/animals/{id}', [AnimalController::class, 'update']);
Route::delete('/animals/{id}', [AnimalController::class, 'destroy']);

// Health records API
Route::get('/animals/{animal_id}/health-records', [AnimalHealthRecordController::class, 'index']);
Route::post('/health-records', [AnimalHealthRecordController::class, 'store']);
Route::get('/health-records/{id}', [AnimalHealthRecordController::class, 'show']);
Route::put('/health-records/{id}', [AnimalHealthRecordController::class, 'update']);
Route::delete('/health-records/{id}', [AnimalHealthRecordController::class, 'destroy']);

// Field management API

Route::get('/fields', [FieldController::class, 'index']);
Route::post('/fields', [FieldController::class, 'store']);
Route::get('/fields/{id}', [FieldController::class, 'show']);
Route::put('/fields/{id}', [FieldController::class, 'update']);
Route::delete('/fields/{id}', [FieldController::class, 'destroy']);

// Crop management API

Route::get('/crops', [CropController::class, 'index']);
Route::post('/crops', [CropController::class, 'store']);
Route::get('/crops/{id}', [CropController::class, 'show']);
Route::put('/crops/{id}', [CropController::class, 'update']);
Route::delete('/crops/{id}', [CropController::class, 'destroy']);

// Planting management API

Route::get('/plantings', [PlantingController::class, 'index']);
Route::post('/plantings', [PlantingController::class, 'store']);
Route::get('/plantings/{id}', [PlantingController::class, 'show']);
Route::put('/plantings/{id}', [PlantingController::class, 'update']);
Route::delete('/plantings/{id}', [PlantingController::class, 'destroy']);

// harvesting management API

Route::get('/harvests', [HarvestController::class, 'index']);
Route::post('/harvests', [HarvestController::class, 'store']);
Route::get('/harvests/{id}', [HarvestController::class, 'show']);
Route::put('/harvests/{id}', [HarvestController::class, 'update']);
Route::delete('/harvests/{id}', [HarvestController::class, 'destroy']);

// Input management API

Route::get('/inputs', [InputController::class, 'index']);
Route::post('/inputs', [InputController::class, 'store']);
Route::get('/inputs/{id}', [InputController::class, 'show']);
Route::put('/inputs/{id}', [InputController::class, 'update']);
Route::delete('/inputs/{id}', [InputController::class, 'destroy']);