<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // Input usage per field
    public function inputUsagePerField()
    {
        $report = DB::table('input_usages')
            ->join('plantings', 'input_usages.planting_id', '=', 'plantings.id')
            ->join('fields', 'plantings.field_id', '=', 'fields.id')
            ->join('inputs', 'input_usages.input_id', '=', 'inputs.id')
            ->select(
                'fields.id as field_id',
                'fields.name as field_name',
                'inputs.name as input_name',
                DB::raw('SUM(input_usages.quantity_used) as total_used')
            )
            ->groupBy('fields.id', 'fields.name', 'inputs.name')
            ->get();

        return response()->json($report);
    }
    // New report method to calculate harvest yield per field

    public function harvestYieldPerField()
    {
        $report = DB::table('harvests')
            ->join('plantings', 'harvests.planting_id', '=', 'plantings.id')
            ->join('fields', 'plantings.field_id', '=', 'fields.id')
            ->join('crops', 'plantings.crop_id', '=', 'crops.id')
            ->select(
                'fields.id as field_id',
                'fields.name as field_name',
                'crops.name as crop_name',
                DB::raw('SUM(harvests.quantity_harvested) as total_yield')
            )
            ->groupBy('fields.id', 'fields.name', 'crops.name')
            ->get();

        return response()->json($report);
    }
    // New report method to identify low stock inputs

    public function lowStock(Request $request)
{
    $threshold = $request->query('threshold', 100);

    $report = \App\Models\Inventory::with('input')
        ->where('quantity_available', '<', $threshold)
        ->get();

    return response()->json($report);
}
// New report method to calculate worker productivity
public function workerProductivity()
{
    $report = \Illuminate\Support\Facades\DB::table('tasks')
        ->join('workers', 'tasks.worker_id', '=', 'workers.id')
        ->select(
            'workers.id as worker_id',
            'workers.name as worker_name',
            \Illuminate\Support\Facades\DB::raw('COUNT(tasks.id) as total_tasks'),
            \Illuminate\Support\Facades\DB::raw("SUM(CASE WHEN tasks.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks")
        )
        ->groupBy('workers.id', 'workers.name')
        ->get();

    return response()->json($report);
}
// New report method to calculate input cost per field
public function inputCostPerField()
{
    $report = \Illuminate\Support\Facades\DB::table('input_usages')
        ->join('plantings', 'input_usages.planting_id', '=', 'plantings.id')
        ->join('fields', 'plantings.field_id', '=', 'fields.id')
        ->join('inputs', 'input_usages.input_id', '=', 'inputs.id')
        ->select(
            'fields.id as field_id',
            'fields.name as field_name',
            \Illuminate\Support\Facades\DB::raw('SUM(input_usages.quantity_used * inputs.cost_per_unit) as total_cost')
        )
        ->groupBy('fields.id', 'fields.name')
        ->get();

    return response()->json($report);
}
// Add more report methods as needed this adds price per unit to the crops table and includes it in the crop model, allowing us to calculate the cost of inputs used for each field based on the quantity used and the cost per unit of each input.
public function profitPerField()
{
    $report = \Illuminate\Support\Facades\DB::table('harvests')
        ->join('plantings', 'harvests.planting_id', '=', 'plantings.id')
        ->join('fields', 'plantings.field_id', '=', 'fields.id')
        ->join('crops', 'plantings.crop_id', '=', 'crops.id')
        ->leftJoin('input_usages', 'plantings.id', '=', 'input_usages.planting_id')
        ->leftJoin('inputs', 'input_usages.input_id', '=', 'inputs.id')
        ->select(
            'fields.id as field_id',
            'fields.name as field_name',
            DB::raw('SUM(harvests.yield_quantity * crops.price_per_unit) as revenue'),
            DB::raw('SUM(input_usages.quantity_used * inputs.cost_per_unit) as cost'),
            DB::raw('SUM(harvests.yield_quantity * crops.price_per_unit) - 
                     SUM(input_usages.quantity_used * inputs.cost_per_unit) as profit')
        )
        ->groupBy('fields.id', 'fields.name')
        ->get();

    return response()->json($report);
}
// Add more report methods as needed FOR dashboard and analytics and show them in the frontend to help farmers make informed decisions about their operations.
public function dashboard()
{
    // Total animals
    $totalAnimals = \App\Models\Animal::count();

    // Total fields
    $totalFields = \App\Models\Field::count();

    // Total workers
    $totalWorkers = \App\Models\Worker::count();

    // Total inputs in stock
    $totalStock = \App\Models\Inventory::sum('quantity_available');

    // Low stock items
    $lowStock = \App\Models\Inventory::where('quantity_available', '<', 100)->count();

    // Total harvest yield
    $totalYield = \App\Models\Harvest::sum('yield_quantity');

    // Total cost
    $harvestCost = \Illuminate\Support\Facades\DB::table('input_usages')
        ->join('inputs', 'input_usages.input_id', '=', 'inputs.id')
        ->sum(\Illuminate\Support\Facades\DB::raw('input_usages.quantity_used * inputs.cost_per_unit'));

    // Total cost
    $transactionExpense = \App\Models\Transaction::where('type', 'expense')->sum('amount');
    $totalCost = $harvestCost + $transactionExpense;

    // Total revenue
    $harvestRevenue = \Illuminate\Support\Facades\DB::table('harvests')
        ->join('plantings', 'harvests.planting_id', '=', 'plantings.id')
        ->join('crops', 'plantings.crop_id', '=', 'crops.id')
        ->sum(\Illuminate\Support\Facades\DB::raw('harvests.yield_quantity * crops.price_per_unit'));

    $transactionIncome = \App\Models\Transaction::where('type', 'income')->sum('amount');
    $totalRevenue = $harvestRevenue + $transactionIncome;

    // Profit
    $profit = $totalRevenue - $totalCost;

    return response()->json([
        'total_animals' => $totalAnimals,
        'total_fields' => $totalFields,
        'total_workers' => $totalWorkers,
        'total_stock' => $totalStock,
        'low_stock_items' => $lowStock,
        'total_yield' => $totalYield,
        'total_cost' => $totalCost,
        'total_revenue' => $totalRevenue,
        'profit' => $profit
    ]);
}
}
