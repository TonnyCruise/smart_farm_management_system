<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $role = $request->user()->role;
        
        if ($role === 'admin' || $role === 'manager') {
            $messages = Message::query()->with(['sender', 'receiver'])->orderBy('created_at', 'desc')->get();
        } else {
            $messages = Message::query()->with(['sender', 'receiver'])
                ->where('receiver_id', $userId)
                ->orWhere('sender_id', $userId)
                ->orderBy('created_at', 'desc')->get();
        }

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $validated['receiver_id'],
            'subject' => $validated['subject'],
            'body' => $validated['body'],
        ]);

        return response()->json($message->load('sender', 'receiver'), 201);
    }
}
