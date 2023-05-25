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

    function getImageEncodedPath($image_path){
        list(, $type) = explode(".", $image_path);
        return "data:image/".$type.";base64,".base64_encode(file_get_contents($image_path));
    }

    $connection = getDBConnection();
    $statement = $connection->prepare("SELECT * FROM $product_table_name WHERE id = ?");
    $statement->bind_param("s", $data["id"]);
    $statement->execute();
    $result = $statement->get_result();
    $response = $result->fetch_assoc();
    $result->free_result();
    $response["image_path"] = getImageEncodedPath($response["image_path"]);
    $statement->close();
    $connection->close();
    echo json_encode($response);
?>