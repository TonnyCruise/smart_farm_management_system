<?php

namespace App\Http\Controllers;

use App\Models\InputUsage;
use App\Models\Input;
use Illuminate\Http\Request;

class InputUsageController extends Controller
{
    // List all input usages
    public function index()
    {
        return InputUsage::with(['planting','input'])->get();
    }

    // Create usage record
    public function store(Request $request)
    {
        $request->validate([
            'planting_id' => 'required|exists:plantings,id',
            'input_id' => 'required|exists:inputs,id',
            'quantity_used' => 'required|numeric',
            'usage_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        // 🚨 Prevent overuse - check stock
        $input = Input::findOrFail($request->input_id);
        if ($input->quantity < $request->quantity_used) {
            return response()->json(['error' => 'Not enough stock. Available: ' . $input->quantity . ' ' . $input->unit], 400);
        }

        // 💰 Calculate total cost
        $total_cost = $request->quantity_used * $input->cost_per_unit;

        // 📉 Deduct inventory
        $input->quantity -= $request->quantity_used;
        $input->save();

        // 🧾 Save usage with calculated cost
        $usage = InputUsage::create([
            'planting_id' => $request->planting_id,
            'input_id' => $request->input_id,
            'quantity_used' => $request->quantity_used,
            'total_cost' => $total_cost,
            'usage_date' => $request->usage_date,
            'notes' => $request->notes
        ]);

        return response()->json($usage, 201);
    }

    // Get single usage
    public function show($id)
    {
        $usage = InputUsage::with(['planting','input'])->find($id);

        if (!$usage) {
            return response()->json(['message' => 'Usage not found'], 404);
        }

        return $usage;
    }

    // Update usage
    public function update(Request $request, $id)
    {
        $usage = InputUsage::find($id);

        if (!$usage) {
            return response()->json(['message' => 'Usage not found'], 404);
        }

        $usage->update($request->all());

        return $usage;
    }

    // Delete usage
    public function destroy($id)
    {
        $usage = InputUsage::find($id);

        if (!$usage) {
            return response()->json(['message' => 'Usage not found'], 404);
        }

        $usage->delete();

        return response()->json(['message' => 'Usage deleted']);
    }
}