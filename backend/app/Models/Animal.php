<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Animal extends Model
{
    protected $fillable = [
        'animal_tag',
        'species',
        'breed',
        'gender',
        'birth_date',
        'health_status',
        'purchase_price'
    ];

    public function healthRecords()
    {
        return $this->hasMany(AnimalHealthRecord::class);
    }
}