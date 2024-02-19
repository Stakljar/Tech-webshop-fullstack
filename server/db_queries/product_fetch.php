<?php
    if($_SERVER["REQUEST_METHOD"] === "GET"){
        echo "This file should not be accessed through browser.";
        exit;
    }
    
    require "../db_conn/connection.php";
    require "../utils/headers.php";
    require "../utils/db_components.php";
    require "../jwt/jwt.php";
    require "../utils/get_image_encoded_path.php";

    $request = file_get_contents("php://input");
    $data = json_decode($request, true);

    $connection = getDBConnection();
    $statement = $connection->prepare("SELECT * FROM $product_table_name WHERE id = ?");
    $statement->bind_param("s", $data["id"]);
    $statement->execute();
    $result = $statement->get_result();
    if($result === false){
        http_response_code(500);
    }
    $row = $result->fetch_assoc();
    if($row === false){
        http_response_code(500);
    }
    else if($row === null) {
        http_response_code(404);
    }
    $response = $row;
    $result->free_result();
    $response["image_path"] = getImageEncodedPath($response["image_path"]);
    $statement->close();
    $connection->close();
    echo json_encode($response);
?>