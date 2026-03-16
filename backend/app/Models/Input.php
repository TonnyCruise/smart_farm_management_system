<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Input extends Model
{
    protected $fillable = [
        'name',
        'type',
        'unit',
        'cost_per_unit'
    ];

    public function inputUsages()
{
    return $this->hasMany(InputUsage::class);
}
}
