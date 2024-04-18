<?php
    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        echo "POST method required.";
        exit;
    }
    
    require "../../db_conn/connection.php";
    require "../../utils/headers.php";
    require "../../utils/db_components.php";
    require "../../jwt/jwt.php";

    $request = file_get_contents(("php://input"));
    $data = json_decode($request, true);

    try{
        $connection = getDBConnection();
        $statement = $connection->prepare("INSERT INTO $user_table_name VALUES (?, ?)");
        $password = password_hash($data["password"], PASSWORD_BCRYPT);
        $statement->bind_param("ss", $data["username"], $password);
        $statement->execute();
        $response["status"] = "valid";
        $response["access_token"] = generateAccessJWT($data["username"], "user");
        $response["id"] = $data["username"];
        $response["role"] = "user";
        if($data["cookieAgreement"] === "accepted"){
            setcookie("refresh_token", generateRefreshJWT($data["username"], "user"));
        }
        echo json_encode($response);
    }
    catch(mysqli_sql_exception $e){
        if($e->getCode() === 1062){
            $response["status"] = "duplicate";
            echo json_encode($response);
        }
        else{
            http_response_code(500);
        }
    }
    $statement->close();
    $connection->close();
?>