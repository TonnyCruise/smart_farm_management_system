<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Harvest extends Model
{
    protected $fillable = [
        'planting_id',
        'harvest_date',
        'yield_quantity',
        'notes'
    ];

    public function planting()
    {
        return $this->belongsTo(Planting::class);
    }
}
