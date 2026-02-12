<?php
namespace Api\Helpers;

class Validators
{
    public  function validateParams(array $params): array
    {
        $errors = [];

        foreach ($params as $key => $value) {
            switch ($key) {
                case 'name':
                    if (empty(trim($value))) {
                        $errors[] = 'Nombre es requerido';
                    }
                    break;


                case 'email':
                    if (empty(trim($value))) {
                        $errors[] = 'Email es requerido.';

                    } elseif (!filter_var($value, FILTER_VALIDATE_EMAIL)) {

                        $errors[] = 'Email tiene un formato incorrecto';
                    }
                    break;
            }
        }
        return $errors;
    }


}