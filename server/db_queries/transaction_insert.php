<?php
    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        echo "POST method required.";
        exit;
    }

    require "../db_conn/connection.php";
    require "../utils/headers.php";
    require "../utils/db_components.php";
    require "../jwt/jwt.php";

    $request = file_get_contents("php://input");
    $data = json_decode($request, true);
    if($data["role"] !== "user" && $data["role"] !== "guest") {
        http_response_code(403);
        exit;
    }

    if($data["requireCredentials"]){
        $requestHeaders = apache_request_headers();
        list(, $token) = explode(" ", $requestHeaders["Authorization"]);
        performValidationProcess($token, $data["id"], $data["role"]);
    }

    $connection = getDBConnection();
    try{
        $connection->begin_transaction();
        $status = "pending";
        $deliveryDate = NULL;
        foreach((array) $data["products"] as $product){
            $statement = $connection->prepare("INSERT INTO $transaction_table_name VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $id = uniqid();
            $statement->bind_param("sssssssssssisss", $id, $data["id"], $product["id"], $data["recipientData"]["firstName"],
             $data["recipientData"]["lastName"], $data["recipientData"]["email"], $data["recipientData"]["phone"], $data["recipientData"]["address"], 
             $data["recipientData"]["city"], $data["recipientData"]["zip"], $data["recipientData"]["country"], $product["quantity"], $status,
                $data["orderDate"], $deliveryDate);
            if($statement->execute() === false) {
                http_response_code(500);
            }
            $statement->close();
            $statement = $connection->prepare("UPDATE $product_table_name SET current_amount = current_amount - ? WHERE id = ?");
            $statement->bind_param("ss", $product["quantity"], $product["id"]);
            if($statement->execute() === false) {
                $connection->close();
                http_response_code(500);
                exit;
            }
            $statement->close();
        }
        $connection->commit();
    }
    catch(mysqli_sql_exception $e){
        $connection->rollback();
        $statement->close();
        if($e->getCode() === 1452){
            $response["status"] = "deleted";
            echo json_encode($response);
        }
        else if($e->getCode() === 1644){
            $response["status"] = "exceeded";
            echo json_encode($response);
        }
        else{
            http_response_code(500);
        }
    }
    $connection->close();
?>
