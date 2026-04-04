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

    public function store(Request $request)
    {
        $quantity = $request->input('quantity', 1);
        $species = $request->species;
        $prefix = strtoupper(substr($species, 0, 3)) . '-';

        // Retrieve last sequential tracker value
        $lastAnimal = Animal::where('animal_tag', 'like', "{$prefix}%")->orderBy('id', 'desc')->first();
        $startNum = 1;
        if ($lastAnimal) {
            $parts = explode('-', $lastAnimal->animal_tag);
            if (count($parts) > 1 && is_numeric($parts[1])) {
                $startNum = intval($parts[1]) + 1;
            }
        }

        if ($quantity > 1) {
            $animalsToInsert = [];
            for ($i = 0; $i < $quantity; $i++) {
                $tag = $prefix . sprintf('%04d', $startNum + $i);
                $animalsToInsert[] = [
                    'animal_tag' => $tag,
                    'species' => $species,
                    'breed' => $request->breed,
                    'gender' => $request->gender,
                    'birth_date' => $request->birth_date,
                    'health_status' => $request->health_status,
                    'purchase_price' => $request->input('purchase_price', 0),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            
            Animal::insert($animalsToInsert);
            
            // Financial Expense Entry
            if ($request->input('purchase_price') > 0) {
                \App\Models\Transaction::create([
                    'type' => 'expense',
                    'amount' => $request->input('purchase_price') * $quantity,
                    'description' => "Bulk acquisition of {$quantity} {$species}",
                    'date' => now()->toDateString(),
                    'category' => 'Livestock Acquisition'
                ]);
            }
            
            return response()->json(['message' => "$quantity animals successfully inserted"], 201);
        } else {
            $tag = $request->animal_tag ?: ($prefix . sprintf('%04d', $startNum));
            $animal = Animal::create([
                'animal_tag' => $tag,
                'species' => $species,
                'breed' => $request->breed,
                'gender' => $request->gender,
                'birth_date' => $request->birth_date,
                'health_status' => $request->health_status,
                'purchase_price' => $request->input('purchase_price', 0)
            ]);

            if ($request->input('purchase_price') > 0) {
                \App\Models\Transaction::create([
                    'type' => 'expense',
                    'amount' => $request->input('purchase_price'),
                    'description' => "Acquisition of 1 {$species} (Tag: {$tag})",
                    'date' => now()->toDateString(),
                    'category' => 'Livestock Acquisition'
                ]);
            }

            return response()->json($animal, 201);
        }
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