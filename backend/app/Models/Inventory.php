<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = [
        'input_id',
        'quantity_available'
    ];

    public function input()
    {
        return $this->belongsTo(Input::class);
    }
}
