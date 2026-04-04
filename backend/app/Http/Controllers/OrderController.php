<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('items', 'user')->orderBy('created_at', 'desc');
        // Customers only see their own orders. Staff sees all relevant orders.
        if ($request->user()->role === 'customer') {
            $query->where('user_id', $request->user()->id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_amount' => 'required|numeric',
            'items' => 'required|array',
            'items.*.category' => 'required|string',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $validated['total_amount'],
                'status' => 'pending'
            ]);

            foreach ($validated['items'] as $item) {
                $order->items()->create($item);
            }

            DB::commit();
            return response()->json($order->load('items'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to place order'], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $oldStatus = $order->status;

        $targetStatus = $request->input('status');

        if ($targetStatus === 'confirmed') {
            foreach($order->items as $item) {
                // Calculate real livestock directly from the registry
                $stock = \App\Models\Animal::where('species', 'like', "%{$item->category}%")->count();
                if ($stock < $item->quantity) {
                    // Send an internal notification about the barrier
                    \App\Models\Message::create([
                        'sender_id' => clone $request->user() ? $request->user()->id : null,
                        'receiver_id' => null,
                        'subject' => "Low Stock Alert: Order Blocked",
                        'body' => "Order #{$id} requires {$item->quantity} {$item->category}, but only {$stock} are available currently. Action required to restock."
                    ]);
                    
                    return response()->json(['message' => "Order blocked: Insufficient {$item->category} livestock. Required {$item->quantity}, Available: {$stock}."], 400);
                }
            }
        }

        $order->status = $targetStatus;
        $order->save();

        if ($oldStatus !== $order->status) {
            $messageBody = "Your order #$id has been updated to: " . $order->status;
            if ($order->status === 'confirmed') {
                $messageBody = "Good news! Your order #$id has been confirmed by the Farm Admin and is now actively being processed by our staff.";
            } elseif ($order->status === 'completed') {
                $messageBody = "Great news! Your order #$id has been completed securely and successfully shipped.";
            }

            \App\Models\Message::create([
                'sender_id' => $request->user()->id,
                'receiver_id' => $order->user_id,
                'subject' => "Order #$id Status Update",
                'body' => $messageBody
            ]);
        }

        return response()->json($order);
    }
}
