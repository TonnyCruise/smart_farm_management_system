<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // List all tasks
    public function index()
    {
        return Task::with(['worker','field','planting'])->get();
    }

    // Create a new task
    public function store(Request $request)
    {
        $request->validate([
            'worker_id' => 'required|exists:workers,id',
            'field_id' => 'required|exists:fields,id',
            'planting_id' => 'nullable|exists:plantings,id',
            'task_name' => 'required|string',
            'task_date' => 'required|date',
            'status' => 'nullable|in:pending,in_progress,completed',
            'notes' => 'nullable|string'
        ]);

        $task = Task::create($request->all());

        return response()->json($task, 201);
    }

    // Get a single task
    public function show($id)
    {
        $task = Task::with(['worker','field','planting'])->find($id);

        if (!$task) {
            return response()->json(['message'=>'Task not found'], 404);
        }

        return $task;
    }

    // Update a task
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message'=>'Task not found'], 404);
        }

        $task->update($request->all());

        return $task;
    }

    // Delete a task
    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message'=>'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message'=>'Task deleted']);
    }
}