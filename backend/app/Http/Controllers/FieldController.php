<?php

namespace App\Http\Controllers;

use App\Models\Field;
use Illuminate\Http\Request;

class FieldController extends Controller
{
    // List all fields
    public function index()
    {
        return Field::all();
    }

    // Create field
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'size' => 'required|numeric',
            'soil_type' => 'nullable|string'
        ]);

        $field = Field::create($request->all());

        return response()->json($field, 201);
    }

    // Get one field
    public function show($id)
    {
        $field = Field::find($id);

        if (!$field) {
            return response()->json(['message' => 'Field not found'], 404);
        }

        return $field;
    }

    // Update field
    public function update(Request $request, $id)
    {
        $field = Field::find($id);

        if (!$field) {
            return response()->json(['message' => 'Field not found'], 404);
        }

        $field->update($request->all());

        return $field;
    }

    // Delete field
    public function destroy($id)
    {
        $field = Field::find($id);

        if (!$field) {
            return response()->json(['message' => 'Field not found'], 404);
        }

        $field->delete();

        return response()->json(['message' => 'Field deleted']);
    }
}