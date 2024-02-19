<?php
    if($_SERVER["REQUEST_METHOD"] === "GET"){
        echo "This file should not be accessed through browser.";
        exit;
    }
    
    require "../db_conn/connection.php";
    require "../utils/headers.php";
    require "../utils/db_components.php";
    require "../jwt/jwt.php";

    $request = file_get_contents("php://input");
    $data = json_decode($request, true);

    $requestHeaders = apache_request_headers();
    list(, $token) = explode(" ", $requestHeaders["Authorization"]);
    performValidationProcess($token, $data["id"], $data["role"]);
    $image_path;
    if(!empty($data["image"])){
        list($type, $image_data) = explode(";", $data["image"]);
        list(, $image_data) = explode(",", $image_data);
        $image_data = base64_decode($image_data);
        list(, $type) = explode("image/", $type);
        $image_path = "../resources/products/".uniqid().".".$type;
        file_put_contents($image_path, $image_data);
    }
    else{
        $image_path = "../resources/default.png";
    }

    $connection = getDBConnection();
    $statement = $connection->prepare("INSERT INTO $product_table_name VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $id = uniqid();
    $statement->bind_param("sssdsssi", $id, $data["name"],
     $image_path, $data["price"], $data["type"], $data["brand"], $data["specs"], $data["quantity"]);
    if($statement->execute() === false) {
        http_response_code(500);
    }
    $statement->close();
    $connection->close();
?>