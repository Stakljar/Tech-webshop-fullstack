<?php 
    if($_SERVER["REQUEST_METHOD"] === "GET"){
        echo "This file should not be accessed through browser.";
        exit;
    }
    
    unset($_COOKIE["refresh_token"]);
    setcookie("refresh_token", "");
?>