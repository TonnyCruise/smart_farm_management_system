<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index()
    {
        return Equipment::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'purchase_date' => 'nullable|date',
            'status' => 'required|string|in:active,maintenance,retired',
        ]);

        $equipment = Equipment::create($validated);
        return response()->json($equipment, 201);
    }

    public function show($id)
    {
        $equipment = Equipment::find($id);
        if (!$equipment) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }
        return $equipment;
    }

    public function update(Request $request, $id)
    {
        $equipment = Equipment::find($id);
        if (!$equipment) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:255',
            'purchase_date' => 'nullable|date',
            'status' => 'sometimes|required|string|in:active,maintenance,retired',
        ]);

        $equipment->update($validated);
        return response()->json($equipment);
    }

    public function destroy($id)
    {
        $equipment = Equipment::find($id);
        if (!$equipment) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        $equipment->delete();
        return response()->json(['message' => 'Equipment deleted']);
    }
}
