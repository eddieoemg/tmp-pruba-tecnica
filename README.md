Pasos para prueba de ejecricio numero 3 y 4

Importar schema.sql a la base de datos 


CREATE DATABASE IF NOT EXISTS helvex;
USE helvex;

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




Configurar el archivo "config.php" para al conexion a la base de datos

