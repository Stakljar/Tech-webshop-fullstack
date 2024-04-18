<?php 
    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        echo "POST method required.";
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
    if($data["role"] === "employee"){
        $statement = $connection->prepare("UPDATE $employee_table_name SET user_password = ? WHERE username = ?");
        $password = password_hash($data["password"], PASSWORD_BCRYPT);
        $statement->bind_param("ss", $password, $data["id"]);
        if($statement->execute() === false) {
            http_response_code(500);
        }
        $statement->close();
        $connection->close();
    }
    else{
        $statement = $connection->prepare("UPDATE $user_table_name SET user_password = ? WHERE username = ?");
        $password = password_hash($data["password"], PASSWORD_BCRYPT);
        $statement->bind_param("ss", $password, $data["id"]);
        if($statement->execute() === false) {
            http_response_code(500);
        }
        $statement->close();
        $connection->close();
    }
?>