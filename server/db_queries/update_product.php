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

    $connection = getDBConnection();
    $statement = $connection->prepare("UPDATE $product_table_name SET price = ?, current_amount = ? WHERE id = ?");
    $statement->bind_param("dis", $data["price"], $data["quantity"], $data["productId"]);
    $statement->execute();
    $statement->close();
    $connection->close();
?>