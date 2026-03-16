<?php

namespace App\Http\Controllers;

use App\Models\Planting;
use Illuminate\Http\Request;

class PlantingController extends Controller
{
    // List all plantings
    public function index()
    {
        return Planting::with(['field','crop'])->get();
    }

    // Store planting
    public function store(Request $request)
    {
        $request->validate([
            'field_id' => 'required|exists:fields,id',
            'crop_id' => 'required|exists:crops,id',
            'planting_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        $planting = Planting::create($request->all());

        return response()->json($planting, 201);
    }

    // Get single planting
    public function show($id)
    {
        $planting = Planting::with(['field','crop'])->find($id);

        if (!$planting) {
            return response()->json(['message' => 'Planting not found'], 404);
        }

        return $planting;
    }

    // Update planting
    public function update(Request $request, $id)
    {
        $planting = Planting::find($id);

        if (!$planting) {
            return response()->json(['message' => 'Planting not found'], 404);
        }

        $planting->update($request->all());

        return $planting;
    }

    // Delete planting
    public function destroy($id)
    {
        $planting = Planting::find($id);

        if (!$planting) {
            return response()->json(['message' => 'Planting not found'], 404);
        }

        $planting->delete();

        return response()->json(['message' => 'Planting deleted']);
    }
}