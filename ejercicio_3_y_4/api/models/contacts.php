<?php

namespace Api\Models;

use Api\DB\Query;


class ContactModel
{
    private $db;

    public function __construct()
    {
        $this->db = new Query();
    }

    public function parseValue($param): string
    {
        return htmlspecialchars(trim($param), ENT_QUOTES, 'UTF-8');
    }

    public function create(array $params): int|string
    {

        return $this->db->insert('contacts', [
            'name' => $this->parseValue($params['name']),
            'phone' => $this->parseValue($params['phone']),
            'email' => $this->parseValue($params['email']),
            'created_at' => date('Y-m-d H:i:s')
        ]);

    }

    public function fetch($order = 'DESC'): array|string
    {

        return $this->db->select('contacts', '*', 'created_at', $order);


    }
}