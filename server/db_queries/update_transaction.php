<?php
    if($_SERVER["REQUEST_METHOD"] !== "POST" && $_SERVER["REQUEST_METHOD"] !== "PATCH"){
        echo "POST or PATCH method required.";
        exit;
    }

    require "../db_conn/connection.php";
    require "../utils/headers.php";
    require "../utils/db_components.php";
    require "../jwt/jwt.php";
    require "../mail/send_mail.php";

    $request = file_get_contents("php://input");
    $data = json_decode($request, true);

    if($data["role"] !== "employee") {
        http_response_code(403);
        exit;
    }

    $requestHeaders = apache_request_headers();
    list(, $token) = explode(" ", $requestHeaders["Authorization"]);
    performValidationProcess($token, $data["id"], $data["role"]);

    $connection = getDBConnection();
    $statement = $connection->prepare("UPDATE $transaction_table_name SET transaction_status = ? WHERE id = ?");
    $statement->bind_param("ss", $data["updatedStatus"], $data["transactionId"]);
    if($statement->execute() === false) {
        $statement->close();
        $connection->close();
        http_response_code(500);
        exit;
    }
    $statement->close();
    $connection->close();

    if($data["updatedStatus"] === "confirmed"){
        sendMail($data["email"], "confirmed", $data["productName"]);
    }
?>