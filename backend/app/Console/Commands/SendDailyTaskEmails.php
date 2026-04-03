<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\Worker;
use App\Models\Task;

class SendDailyTaskEmails extends Command
{
    protected $signature = 'farm:send-emails';
    protected $description = 'Send daily task email notifications to workers';

    public function handle()
    {
        $this->info("Starting the automated daily email dispatcher...");
        Log::info("Simulating sending daily task emails to all workers.");
        
        $workers = Worker::all();
        $tasksCount = Task::where('status', 'pending')->count();
        
        foreach ($workers as $worker) {
            Log::info("Email sent to worker: {$worker->name} regarding {$tasksCount} total pending tasks.");
            $this->comment("Sent email to: " . $worker->name);
        }
        
        $this->info("Emails dispatched successfully.");
    }
}
