<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InputUsage extends Model
{
    // Fillable fields for mass assignment
    protected $fillable = [
        'planting_id',
        'input_id',
        'quantity_used',
        'usage_date',
        'notes'
    ];

    public function planting()
    {
        return $this->belongsTo(Planting::class);
    }

    public function input()
    {
        return $this->belongsTo(Input::class);
    }
}
