<?php 
    $secret = "rwjnddwhbgdte8514124351164805404";

    $header = json_encode([
        "typ" => "JWT",
        "alg" => "HS256"
    ]);

    $base64UrlHeader = base64EncodeWithReplacement($header);

    function generateAccessJWT($username, $role){

        $payload = json_encode([
            "user" => $username,
            "role" => $role,
            "exp" => time() + (15 * 60)
        ]);

        return generateJWT($payload);
    }

    function generateRefreshJWT($username, $role){

        $payload = json_encode([
            "user" => $username,
            "role" => $role,
            "exp" => time() + (90 * 3600)
        ]);

        return generateJWT($payload);
    }

    function generateJWT($payload){
        global $base64UrlHeader, $secret;
        $base64UrlPayload = base64EncodeWithReplacement($payload);
        
        $signature = hash_hmac("sha256", $base64UrlHeader . "." . $base64UrlPayload, $secret, true);

        $base64UrlSignature = base64EncodeWithReplacement($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    function validateJWT($jwt){
        global $secret;
        $tokenParts = explode('.', $jwt);
        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1]);
        $signatureProvided = $tokenParts[2];

        if(json_decode($payload, true)["exp"] < time()){
            return "expired";
        }

        $base64UrlHeader = base64EncodeWithReplacement($header);
        $base64UrlPayload = base64EncodeWithReplacement($payload);
        $signature = hash_hmac("sha256", $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = base64EncodeWithReplacement($signature);

        if ($base64UrlSignature === $signatureProvided) {
            return "valid";
        } 
        else{
            return "invalid";
        }
    }

    function performValidationProcess($token, $username, $role){
        if(empty($token) || validateJWT($token) === "expired"){
            http_response_code(401);
            exit;
        }
        else if(validateJWT($token) === "invalid"){
            http_response_code(403);
            exit;
        }
        $data = getUserData($token);
        if($data["user"] != $username || $data["role"] != $role){
            http_response_code(403);
            exit;
        }
    }

    function base64EncodeWithReplacement($data){
        return str_replace(
            ['+', '/', '='],
            ['-', '_', ''],
            base64_encode($data));
    }

    function getUserData($jwt){
        $tokenParts = explode(".", $jwt);
        $payload = base64_decode($tokenParts[1]);

        return json_decode($payload, true);
    }
?>
