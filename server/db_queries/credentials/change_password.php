<?php 
    if($_SERVER["REQUEST_METHOD"] === "GET"){
        echo "This file should not be accessed through browser.";
        exit;
    }
    
    require "../../db_conn/connection.php";
    require "../../utils/headers.php";
    require "../../utils/db_components.php";
    require "../../jwt/jwt.php";

    $request = file_get_contents("php://input");
    $data = json_decode($request, true);
    
    $requestHeaders = apache_request_headers();
    list(, $token) = explode(" ", $requestHeaders["Authorization"]);
    performValidationProcess($token, $data["id"], $data["role"]);

    $connection = getDBConnection();
    if($data["role"] === "user"){
        $statement = $connection->prepare("UPDATE $user_table_name SET user_password = ? WHERE username = ?");
        $statement->bind_param("ss", password_hash($data["password"], PASSWORD_BCRYPT), $data["id"]);
        $statement->execute();
        $statement->close();
        $connection->close();
    }
    else if($data["role"] === "employee"){
        $statement = $connection->prepare("UPDATE $employee_table_name SET user_password = ? WHERE username = ?");
        $statement->bind_param("ss", password_hash($data["password"], PASSWORD_BCRYPT), $data["id"]);
        $statement->execute();
        $statement->close();
        $connection->close();
    }
?>