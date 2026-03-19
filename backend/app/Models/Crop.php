<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crop extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price_per_unit'
    ];

    public function plantings()
    {
        return $this->hasMany(Planting::class);
    }
}
