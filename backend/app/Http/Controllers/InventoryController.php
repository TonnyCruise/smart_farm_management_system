<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    // List all inventory
    public function index()
    {
        return Inventory::with('input')->get();
    }

    // Add stock
    public function store(Request $request)
{
    $request->validate([
        'planting_id' => 'required|exists:plantings,id',
        'input_id' => 'required|exists:inputs,id',
        'quantity_used' => 'required|numeric',
        'usage_date' => 'required|date',
        'notes' => 'nullable|string'
    ]);

    // Create usage record
    $usage = \App\Models\InputUsage::create($request->all());

    // Find inventory
    $inventory = \App\Models\Inventory::where('input_id', $request->input_id)->first();

    if ($inventory) {
        $inventory->quantity_available -= $request->quantity_used;
        $inventory->save();
    }

    return response()->json($usage, 201);
}

    // Get single inventory record
    public function show($id)
    {
        $inventory = Inventory::with('input')->find($id);

        if (!$inventory) {
            return response()->json(['message' => 'Inventory not found'], 404);
        }

        return $inventory;
    }

    // Update stock
    public function update(Request $request, $id)
    {
        $inventory = Inventory::find($id);

        if (!$inventory) {
            return response()->json(['message' => 'Inventory not found'], 404);
        }

        $inventory->update($request->all());

        return $inventory;
    }

    // Delete record
    public function destroy($id)
    {
        $inventory = Inventory::find($id);

        if (!$inventory) {
            return response()->json(['message' => 'Inventory not found'], 404);
        }

        $inventory->delete();

        return response()->json(['message' => 'Inventory deleted']);
    }
}