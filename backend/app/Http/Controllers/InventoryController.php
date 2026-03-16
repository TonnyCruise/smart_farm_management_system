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
            'input_id' => 'required|exists:inputs,id',
            'quantity_available' => 'required|numeric'
        ]);

        $inventory = Inventory::create($request->all());

        return response()->json($inventory, 201);
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