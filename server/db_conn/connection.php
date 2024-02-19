<?php
    $hostname = "localhost";
    $username = "root";
    $password = "";
    $database = "tech_webshop";
    $port = 3306;
    $socket = "MySQL";

    function getDBConnection(){
        global $hostname, $username, $password, $database, $port, $socket;
        $connection = new mysqli($hostname, $username, $password, $database, $port, $socket);
        if ($connection->connect_error) {
            http_response_code(503);
            exit;
        }
        else{
            return $connection;
        }
    }
?>