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

    $connection = getDBConnection();
    if($data["role"] === "user"){
        $statement = $connection->prepare("SELECT * FROM $user_table_name WHERE username = ?");
    }
    else if($data["role"] === "employee"){
        $statement = $connection->prepare("SELECT * FROM $employee_table_name WHERE username = ?");
    }
    else{
        http_response_code(400);
    }
    $statement->bind_param("s", $data["username"]);
    $statement->execute();
    $result = $statement->get_result();
    if(password_verify($data["password"], $result->fetch_assoc()["user_password"])){
        $response["status"] = "valid";
        $response["access_token"] = generateAccessJWT($data["username"], $data["role"]);
        $response["id"] = $data["username"];
        $response["role"] = $data["role"];
        if($data["cookieAgreement"] === "accepted"){
            setcookie("refresh_token", generateRefreshJWT($data["username"], $data["role"]));
        }
    }
    else{
        $response["status"] = "invalid";
    }
    $result->free_result();
    $statement->close();
    $connection->close();
    echo json_encode($response);
?>