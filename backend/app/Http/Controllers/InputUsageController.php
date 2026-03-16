<?php

namespace App\Http\Controllers;

use App\Models\InputUsage;
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

        $usage = InputUsage::create($request->all());

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