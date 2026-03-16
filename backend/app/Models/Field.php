<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    protected $fillable = [
        'name',
        'size',
        'soil_type'
    ];

    public function plantings()
    {
        return $this->hasMany(Planting::class);
    }
}