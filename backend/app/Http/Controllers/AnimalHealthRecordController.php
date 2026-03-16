<?php

namespace App\Http\Controllers;

use App\Models\AnimalHealthRecord;
use Illuminate\Http\Request;

class AnimalHealthRecordController extends Controller
{
    // List all records for an animal
    public function index($animal_id)
    {
        return AnimalHealthRecord::where('animal_id', $animal_id)->get();
    }

    // Add a new health record
    public function store(Request $request)
    {
        $request->validate([
            'animal_id' => 'required|exists:animals,id',
            'event_type' => 'required|string',
            'vet_name' => 'nullable|string',
            'event_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        $record = AnimalHealthRecord::create($request->all());

        return response()->json($record, 201);
    }

    // Get a single record
    public function show($id)
    {
        $record = AnimalHealthRecord::find($id);
        if (!$record) {
            return response()->json(['message'=>'Record not found'], 404);
        }
        return $record;
    }

    // Update a record
    public function update(Request $request, $id)
    {
        $record = AnimalHealthRecord::find($id);
        if (!$record) {
            return response()->json(['message'=>'Record not found'], 404);
        }
        $record->update($request->all());
        return $record;
    }

    // Delete a record
    public function destroy($id)
    {
        $record = AnimalHealthRecord::find($id);
        if (!$record) {
            return response()->json(['message'=>'Record not found'], 404);
        }
        $record->delete();
        return response()->json(['message'=>'Record deleted']);
    }
}