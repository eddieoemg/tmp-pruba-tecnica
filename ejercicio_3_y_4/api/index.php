<?php

use Api\Helpers\Responses;
use Api\Helpers\Validators;
use Api\Models\ContactModel;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


require './autoload.php';


function initApi(): void
{


    $contacts = new ContactModel();
    $responses = new Responses();
    $validators = new Validators();

    $method = $_SERVER['REQUEST_METHOD'];

    try {


        switch ($method) {
            case 'GET':

                try {
                    $data = $contacts->fetch();
                    $responses->success(['data' => $data]);
                } catch (Exception $e) {
                    $responses->error($e->getMessage());
                }
                break;

            case 'POST':
                $params = json_decode(file_get_contents('php://input'), true);
                if (!$params) {
                    $responses->error(['message' => 'Informacion invalida']);
                }

                $errors = $validators->validateParams($params);


                if (count($errors)>1) {
                    $responses->error(['message' => 'Validacion incorrecta', 'errors' => $errors]);
                }

                try {
                    $result = $contacts->create($params);
                    $responses->success([
                        'success' => true,
                        'data' => $result,
                        'message' => 'Registros guardados correctamente.'
                    ]);
                } catch (Exception $e) {
                    $responses->error(['message' => 'Error al guardar el registro: '. $e->getMessage()]);
                }
                break;

            default:

                $responses->error([
                    'message' => 'Metodo no encontrado.'
                ]);
                break;
        }
    } catch (Exception $e) {
        $responses->error(['message' => 'No se pudo conectar a la base de datos']);
    }
}


initApi();