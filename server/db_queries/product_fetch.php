<?php
    if($_SERVER["REQUEST_METHOD"] !== "GET"){
        echo "GET method required.";
        exit;
    }

    require "../db_conn/connection.php";
    require "../utils/headers.php";
    require "../utils/db_components.php";
    require "../jwt/jwt.php";
    require "../utils/get_image_encoded_path.php";

    $data = $_GET;
    $connection = getDBConnection();
    $statement = $connection->prepare("SELECT * FROM $product_table_name WHERE id = ?");
    $statement->bind_param("s", $data["id"]);
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
    else if($row === null) {
        $result->free_result();
        $statement->close();
        $connection->close();
        http_response_code(404);
        exit;
    }
    $response = $row;
    $result->free_result();
    $response["image_path"] = getImageEncodedPath($response["image_path"]);
    $statement->close();
    $connection->close();
    echo json_encode($response);
?>