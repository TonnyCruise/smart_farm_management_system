<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planting extends Model
{
    protected $fillable = [
        'field_id',
        'crop_id',
        'planting_date',
        'notes'
    ];

    public function field()
    {
        return $this->belongsTo(Field::class);
    }

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function harvest()
    {
        return $this->hasOne(Harvest::class);
    }

    public function inputUsages()
    {
        return $this->hasMany(InputUsage::class);
    }
}
