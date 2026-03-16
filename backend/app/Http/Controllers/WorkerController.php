<?php

namespace App\Http\Controllers;

use App\Models\Worker;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    // List all workers
    public function index()
    {
        return Worker::all();
    }

    // Create worker
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'role' => 'nullable|string',
            'phone' => 'nullable|string'
        ]);

        $worker = Worker::create($request->all());

        return response()->json($worker, 201);
    }

    // Get single worker
    public function show($id)
    {
        $worker = Worker::find($id);

        if (!$worker) {
            return response()->json(['message' => 'Worker not found'], 404);
        }

        return $worker;
    }

    // Update worker
    public function update(Request $request, $id)
    {
        $worker = Worker::find($id);

        if (!$worker) {
            return response()->json(['message' => 'Worker not found'], 404);
        }

        $worker->update($request->all());

        return $worker;
    }

    // Delete worker
    public function destroy($id)
    {
        $worker = Worker::find($id);

        if (!$worker) {
            return response()->json(['message' => 'Worker not found'], 404);
        }

        $worker->delete();

        return response()->json(['message' => 'Worker deleted']);
    }
}