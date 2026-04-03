<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiTest extends TestCase
{
    public function test_api_is_responsive(): void
    {
        $response = $this->get('/api/test');
        $response->assertStatus(200);
        $response->assertJson(['message' => 'API working']);
    }

    public function test_auth_middleware_blocks_unauthorized_access(): void
    {
        $response = $this->getJson('/api/dashboard');
        $response->assertStatus(401);
    }
}
