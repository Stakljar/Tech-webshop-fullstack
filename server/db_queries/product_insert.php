<?php
    if($_SERVER["REQUEST_METHOD"] === "GET"){
        echo "This file should not be accessed through browser.";
        exit;
    }
    
    require "../db_conn/connection.php";
    require "../utils/headers.php";
    require "../utils/db_components.php";
    require "../jwt/jwt.php";

    $requestHeaders = apache_request_headers();
    list(, $token) = explode(" ", $requestHeaders["Authorization"]);
    performValidationProcess($token, $_POST["id"], $_POST["role"]);

    $image_path;
    if(!empty($_POST["image"])){
        list($type, $image_data) = explode(";", $_POST["image"]);
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
    $statement->bind_param("sssdsssi", uniqid(), $_POST["name"],
     $image_path, $_POST["price"], $_POST["type"], $_POST["brand"], $_POST["specs"], $_POST["quantity"]);
    $statement->execute();
    $statement->close();
    $connection->close();
?>