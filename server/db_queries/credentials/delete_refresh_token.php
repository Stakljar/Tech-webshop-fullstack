<?php 
    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        echo "POST method required.";
        exit;
    }
    
    unset($_COOKIE["refresh_token"]);
    setcookie("refresh_token", "");
?>