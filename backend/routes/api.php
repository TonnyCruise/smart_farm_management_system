<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\AnimalHealthRecordController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\PlantingController;
use App\Http\Controllers\HarvestController;
use App\Http\Controllers\InputController;
use App\Http\Controllers\InputUsageController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\WorkerController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;

Route::get('/test', function () {
    return response()->json(['message' => 'API working']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);

    // Animals - all roles can view, only admin/manager can modify
    Route::get('/animals', [AnimalController::class, 'index']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/animals', [AnimalController::class, 'store']);
        Route::put('/animals/{id}', [AnimalController::class, 'update']);
        Route::delete('/animals/{id}', [AnimalController::class, 'destroy']);
    });
    Route::get('/animals/{id}', [AnimalController::class, 'show']);

    // Health records - admin/manager only
    Route::middleware('role:admin,manager')->group(function () {
        Route::get('/animals/{animal_id}/health-records', [AnimalHealthRecordController::class, 'index']);
        Route::post('/health-records', [AnimalHealthRecordController::class, 'store']);
        Route::get('/health-records/{id}', [AnimalHealthRecordController::class, 'show']);
        Route::put('/health-records/{id}', [AnimalHealthRecordController::class, 'update']);
        Route::delete('/health-records/{id}', [AnimalHealthRecordController::class, 'destroy']);
    });

    // Fields - all roles can view, admin/manager can modify
    Route::get('/fields', [FieldController::class, 'index']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/fields', [FieldController::class, 'store']);
        Route::put('/fields/{id}', [FieldController::class, 'update']);
        Route::delete('/fields/{id}', [FieldController::class, 'destroy']);
    });
    Route::get('/fields/{id}', [FieldController::class, 'show']);

    // Crops - all roles can view, admin/manager can modify
    Route::get('/crops', [CropController::class, 'index']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/crops', [CropController::class, 'store']);
        Route::put('/crops/{id}', [CropController::class, 'update']);
        Route::delete('/crops/{id}', [CropController::class, 'destroy']);
    });
    Route::get('/crops/{id}', [CropController::class, 'show']);

    // Plantings - all roles can view, admin/manager can modify
    Route::get('/plantings', [PlantingController::class, 'index']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/plantings', [PlantingController::class, 'store']);
        Route::put('/plantings/{id}', [PlantingController::class, 'update']);
        Route::delete('/plantings/{id}', [PlantingController::class, 'destroy']);
    });
    Route::get('/plantings/{id}', [PlantingController::class, 'show']);

    // Harvests - all roles can view, admin/manager can modify
    Route::get('/harvests', [HarvestController::class, 'index']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/harvests', [HarvestController::class, 'store']);
        Route::put('/harvests/{id}', [HarvestController::class, 'update']);
        Route::delete('/harvests/{id}', [HarvestController::class, 'destroy']);
    });
    Route::get('/harvests/{id}', [HarvestController::class, 'show']);

    // Inputs - all roles can view, admin/manager can modify
    Route::get('/inputs', [InputController::class, 'index']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/inputs', [InputController::class, 'store']);
        Route::put('/inputs/{id}', [InputController::class, 'update']);
        Route::delete('/inputs/{id}', [InputController::class, 'destroy']);
    });
    Route::get('/inputs/{id}', [InputController::class, 'show']);

    // Input Usages - all roles can view, admin/manager can modify
    Route::get('/input-usages', [InputUsageController::class, 'index']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/input-usages', [InputUsageController::class, 'store']);
        Route::put('/input-usages/{id}', [InputUsageController::class, 'update']);
        Route::delete('/input-usages/{id}', [InputUsageController::class, 'destroy']);
    });
    Route::get('/input-usages/{id}', [InputUsageController::class, 'show']);

    // Inventories - all roles can view, admin/manager can modify
    Route::get('/inventories', [InventoryController::class, 'index']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/inventories', [InventoryController::class, 'store']);
        Route::put('/inventories/{id}', [InventoryController::class, 'update']);
        Route::delete('/inventories/{id}', [InventoryController::class, 'destroy']);
    });
    Route::get('/inventories/{id}', [InventoryController::class, 'show']);

    // Workers - admin/manager only
    Route::middleware('role:admin,manager')->group(function () {
        Route::get('/workers', [WorkerController::class, 'index']);
        Route::post('/workers', [WorkerController::class, 'store']);
        Route::get('/workers/{id}', [WorkerController::class, 'show']);
        Route::put('/workers/{id}', [WorkerController::class, 'update']);
        Route::delete('/workers/{id}', [WorkerController::class, 'destroy']);
    });

    // Tasks - all roles can view/create their tasks, admin/manager can modify all
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::put('/tasks/{id}', [TaskController::class, 'update']);
        Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    });

    // Reports & Dashboard - admin/manager only
    Route::middleware('role:admin,manager')->group(function () {
        Route::get('/reports/input-usage-per-field', [ReportController::class, 'inputUsagePerField']);
        Route::get('/reports/harvest-yield-per-field', [ReportController::class, 'harvestYieldPerField']);
        Route::get('/reports/low-stock', [ReportController::class, 'lowStock']);
        Route::get('/reports/worker-productivity', [ReportController::class, 'workerProductivity']);
        Route::get('/reports/input-cost-per-field', [ReportController::class, 'inputCostPerField']);
        Route::get('/reports/profit-per-field', [ReportController::class, 'profitPerField']);
        Route::get('/dashboard', [ReportController::class, 'dashboard']);
    });
});
