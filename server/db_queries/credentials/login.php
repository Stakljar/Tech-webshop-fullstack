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

    if($data["role"] !== "user" && $data["role"] !== "employee"){
        http_response_code(400);
        exit;
    }

    $connection = getDBConnection();
    if($data["role"] === "employee"){
        $statement = $connection->prepare("SELECT * FROM $employee_table_name WHERE username = ?");
    }
    else{
        $statement = $connection->prepare("SELECT * FROM $user_table_name WHERE username = ?");
    }
    $statement->bind_param("s", $data["username"]);
    $statement->execute();
    $result = $statement->get_result();
    if($result === false){
        $statement->close();
        $connection->close();
        http_response_code(500);
        exit;
    }
    $row = $result->fetch_assoc();
    if($row === false){
        $result->free_result();
        $statement->close();
        $connection->close();
        http_response_code(500);
        exit;
    }
    if(password_verify($data["password"], $row !== null ? $row["user_password"] : "")){
        $response["status"] = "valid";
        $response["access_token"] = generateAccessJWT($data["username"], $data["role"]);
        $response["id"] = $data["username"];
        $response["role"] = $data["role"];
        if($data["cookieAgreement"] === "accepted"){
            setcookie("refresh_token", generateRefreshJWT($data["username"], $data["role"]), secure: true, httponly: true);
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
