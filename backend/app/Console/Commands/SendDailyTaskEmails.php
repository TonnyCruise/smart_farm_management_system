<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\Task;

class SendDailyTaskEmails extends Command
{
    protected $signature = 'farm:send-emails';
    protected $description = 'Send daily task email notifications to workers';

    public function handle()
    {
        $this->info("Starting the automated daily email dispatcher...");
        
        $tasksCount = Task::where('status', 'pending')->count();
        
        $testEmails = [
            'tonnycruiseomondi@gmail.com',
            'nygelmars770@gmail.com',
            'tonnyomondiomolo@gmail.com',
            'westleaf609@gmail.com'
        ];
        
        foreach ($testEmails as $email) {
            try {
                Mail::raw("Hello! You have {$tasksCount} pending farm tasks that need your attention today.", function ($message) use ($email) {
                    $message->to($email)
                            ->subject('🚜 Smart Farm Daily Task Update');
                });
                Log::info("Email sent to: {$email}");
                $this->comment("Sent real email to: " . $email);
            } catch (\Exception $e) {
                Log::error("Failed to send email to {$email}: " . $e->getMessage());
                $this->error("Failed to send real email to: " . $email);
                $this->error($e->getMessage());
            }
        }
        
        $this->info("Emails dispatched successfully.");
    }
}
