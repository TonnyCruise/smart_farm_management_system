<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnimalHealthRecord extends Model
{
    //
     protected $fillable = [
        'animal_id',
        'event_type',
        'vet_name',
        'event_date',
        'notes'
    ];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }
}
