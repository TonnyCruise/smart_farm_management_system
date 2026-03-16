<?php

namespace App\Http\Controllers;

use App\Models\Input;
use Illuminate\Http\Request;

class InputController extends Controller
{
    // List all inputs
    public function index()
    {
        return Input::all();
    }

    // Create new input
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'unit' => 'required|string',
            'cost_per_unit' => 'nullable|numeric'
        ]);

        $input = Input::create($request->all());

        return response()->json($input, 201);
    }

    // Get one input
    public function show($id)
    {
        $input = Input::find($id);

        if (!$input) {
            return response()->json(['message' => 'Input not found'], 404);
        }

        return $input;
    }

    // Update input
    public function update(Request $request, $id)
    {
        $input = Input::find($id);

        if (!$input) {
            return response()->json(['message' => 'Input not found'], 404);
        }

        $input->update($request->all());

        return $input;
    }

    // Delete input
    public function destroy($id)
    {
        $input = Input::find($id);

        if (!$input) {
            return response()->json(['message' => 'Input not found'], 404);
        }

        $input->delete();

        return response()->json(['message' => 'Input deleted']);
    }
}