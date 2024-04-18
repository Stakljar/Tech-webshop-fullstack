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

    $requestHeaders = apache_request_headers();
    list(, $token) = explode(" ", $requestHeaders["Authorization"]);
    performValidationProcess($token, $data["id"], $data["role"]);

    $connection = getDBConnection();
    $result = NULL;
    if($data["role"] === "employee"){
        $result = $connection->query("SELECT product_name, $transaction_table_name.id, $product_table_name.id as product_id,
        $transaction_table_name.amount, price, transaction_status, order_date, recipient_name, recipient_surname, recipient_email,
        recipient_phone, recipient_address, recipient_city, recipient_zip, recipient_country FROM $transaction_table_name
        LEFT JOIN $product_table_name ON $transaction_table_name.product_id = $product_table_name.id WHERE NOT transaction_status = 'delivered' ORDER BY transaction_status DESC");
    }
    else{
        $result = $connection->query("SELECT product_name, $transaction_table_name.id, $product_table_name.id as product_id,
        $transaction_table_name.amount, price, transaction_status, order_date, recipient_name, recipient_surname, recipient_email,
        recipient_phone, recipient_address, recipient_city, recipient_zip, recipient_country FROM $transaction_table_name
        LEFT JOIN $product_table_name ON $transaction_table_name.product_id = $product_table_name.id WHERE user_username = '".$data["id"]."'
        AND transaction_status = 'delivered' ORDER BY transaction_status DESC");
    }
    if($result === false){
        $connection->close();
        http_response_code(500);
        exit;
    }
    $result_array = array();
    while($row = $result->fetch_assoc()){
        if($row === false){
            $result->free_result();
            $connection->close();
            http_response_code(500);
            exit;
        }
        $result_array[] = $row;
    }
    $result->free_result();
    $connection->close();
    echo json_encode($result_array);
?>