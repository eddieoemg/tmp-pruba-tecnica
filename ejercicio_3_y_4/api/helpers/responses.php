<?php

namespace Api\Helpers;

class Responses
{
    public function __construct()
    {
        header('Content-Type: application/json');
    }

    public function success($params): void
    {
        http_response_code(200);

        echo json_encode([
            'message' => $params['message'] ?? '',
            'data'    => $params['data'] ?? null
        ]);

        exit;
    }

    public function error($params)
    {
        http_response_code(500);

        echo json_encode([
            'message' => $params['message'],
            'errors'  => $params['$errors'] ?? null
        ]);

        exit;
    }
}