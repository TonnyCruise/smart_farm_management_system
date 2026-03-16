<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    // Get all animals
    public function index()
    {
        return Animal::all();
    }

    // Create a new animal
    public function store(Request $request)
    {
        $animal = Animal::create([
            'animal_tag' => $request->animal_tag,
            'species' => $request->species,
            'breed' => $request->breed,
            'gender' => $request->gender,
            'birth_date' => $request->birth_date,
            'health_status' => $request->health_status
        ]);

        return response()->json($animal, 201);
    }

    public function show($id)
    {
        $animal = Animal::find($id);

        if (!$animal) {
            return response()->json(['message' => 'Animal not found'], 404);
        }

        return $animal;
    }

    public function update(Request $request, $id)
    {
        $animal = Animal::find($id);

        if (!$animal) {
            return response()->json(['message' => 'Animal not found'], 404);
        }

        $animal->update($request->all());

        return response()->json($animal);
    }

    public function destroy($id)
    {
        $animal = Animal::find($id);

        if (!$animal) {
            return response()->json(['message' => 'Animal not found'], 404);
        }

        $animal->delete();

        return response()->json(['message' => 'Animal deleted']);
    }
}