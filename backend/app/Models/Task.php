<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'worker_id',
        'field_id',
        'planting_id',
        'task_name',
        'task_date',
        'status',
        'notes'
    ];

    public function worker()
    {
        return $this->belongsTo(Worker::class);
    }

    public function field()
    {
        return $this->belongsTo(Field::class);
    }

    public function planting()
    {
        return $this->belongsTo(Planting::class);
    }
}
