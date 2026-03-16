<?php

namespace App\Http\Controllers;

use App\Models\Harvest;
use Illuminate\Http\Request;

class HarvestController extends Controller
{
    // List all harvests
    public function index()
    {
        return Harvest::with('planting')->get();
    }

    // Create new harvest
    public function store(Request $request)
    {
        $request->validate([
            'planting_id' => 'required|exists:plantings,id',
            'harvest_date' => 'required|date',
            'yield_quantity' => 'required|numeric',
            'notes' => 'nullable|string'
        ]);

        $harvest = Harvest::create($request->all());

        return response()->json($harvest, 201);
    }

    // Get one harvest
    public function show($id)
    {
        $harvest = Harvest::with('planting')->find($id);

        if (!$harvest) {
            return response()->json(['message' => 'Harvest not found'], 404);
        }

        return $harvest;
    }

    // Update harvest
    public function update(Request $request, $id)
    {
        $harvest = Harvest::find($id);

        if (!$harvest) {
            return response()->json(['message' => 'Harvest not found'], 404);
        }

        $harvest->update($request->all());

        return $harvest;
    }

    // Delete harvest
    public function destroy($id)
    {
        $harvest = Harvest::find($id);

        if (!$harvest) {
            return response()->json(['message' => 'Harvest not found'], 404);
        }

        $harvest->delete();

        return response()->json(['message' => 'Harvest deleted']);
    }
}