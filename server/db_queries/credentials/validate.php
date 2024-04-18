<?php
    if($_SERVER["REQUEST_METHOD"] !== "GET"){
        echo "GET method required.";
        exit;
    }

    require "../../utils/headers.php";
    require "../../jwt/jwt.php";

    if(!isset($_COOKIE["refresh_token"]) || $_COOKIE["refresh_token"] === null){
        $response["id"] = "";
        $response["role"] = "guest";
        $response["access_token"] = "";
        echo json_encode($response);
        exit;
    }

    if(validateJWT($_COOKIE["refresh_token"]) !== "valid"){
        $response["id"] = "";
        $response["role"] = "guest";
        $response["access_token"] = "";
        unset($_COOKIE["refresh_token"]);
        setcookie("refresh_token", "");
        echo json_encode($response);
        exit;
    }

    $username = getUserData($_COOKIE["refresh_token"])["user"];
    $role = getUserData($_COOKIE["refresh_token"])["role"];
    $response["id"] = $username;
    $response["role"] = $role;
    $response["access_token"] = generateAccessJWT($username, $role);
    echo json_encode($response);
?>