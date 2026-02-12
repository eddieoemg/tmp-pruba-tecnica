<?php

namespace Api\DB;


use Exception;
use mysqli;


class Query
{
    private mysqli $connection;


    public function __construct()
    {
        try {
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

            $this->connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            $this->connection->set_charset('utf8');

        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function insert(string $table, array $params)
    {
        $columns = implode(', ', array_keys($params));
        $types = str_repeat('s', count($params));
        $placeholders = implode(', ', array_fill(0, count($params), '?'));

        try {
            $stmt = $this->connection->prepare("INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})");

            $stmt->bind_param($types, ...array_values($params));
            $stmt->execute();

            return $stmt->insert_id;
        } catch (Exception $e) {
            throw new Exception('Error al guardar el registro' . $e->getMessage());

        }
    }


    public function select(string $table, string $columns = '*', ?string $orderColumn = null, string $orderDir = 'ASC'): array
    {
        $sql = "SELECT {$columns} FROM {$table}";

        if ($orderColumn) {
            $dir = ($orderDir === 'DESC') ? 'DESC' : 'ASC';
            $sql .= " ORDER BY {$orderColumn} {$dir}";
        }

        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute();

            $result = $stmt->get_result();
            return $result->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {

            throw new Exception('Error al consultar el registro : ['. $e->getMessage().']');
        }
    }
}