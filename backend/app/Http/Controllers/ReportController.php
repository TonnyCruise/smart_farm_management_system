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

    public function lowStock(Request $request)
{
    $threshold = $request->query('threshold', 100);

    $report = \App\Models\Inventory::with('input')
        ->where('quantity_available', '<', $threshold)
        ->get();

    return response()->json($report);
}
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
}
