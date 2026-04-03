<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::orderBy('date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'category' => 'nullable|string|max:255'
        ]);

        $transaction = Transaction::create($validated);
        return response()->json($transaction, 201);
    }

    public function destroy($id)
    {
        $transaction = Transaction::find($id);
        if (!$transaction) return response()->json(['message' => 'Not found'], 404);
        
        $transaction->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
