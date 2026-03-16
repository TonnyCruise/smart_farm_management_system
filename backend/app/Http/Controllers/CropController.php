<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use Illuminate\Http\Request;

class CropController extends Controller
{
    // List all crops
    public function index()
    {
        return Crop::all();
    }

    // Create a crop
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category' => 'nullable|string'
        ]);

        $crop = Crop::create($request->all());

        return response()->json($crop, 201);
    }

    // Get one crop
    public function show($id)
    {
        $crop = Crop::find($id);

        if (!$crop) {
            return response()->json(['message' => 'Crop not found'], 404);
        }

        return $crop;
    }

    // Update crop
    public function update(Request $request, $id)
    {
        $crop = Crop::find($id);

        if (!$crop) {
            return response()->json(['message' => 'Crop not found'], 404);
        }

        $crop->update($request->all());

        return $crop;
    }

    // Delete crop
    public function destroy($id)
    {
        $crop = Crop::find($id);

        if (!$crop) {
            return response()->json(['message' => 'Crop not found'], 404);
        }

        $crop->delete();

        return response()->json(['message' => 'Crop deleted']);
    }
}