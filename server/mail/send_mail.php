<?php
    use PHPMailer\PHPMailer\PHPMailer;

    require "../phpmailer/src/Exception.php";
    require "../phpmailer/src/PHPMailer.php";
    require "../phpmailer/src/SMTP.php";
    
    $mail = new PHPMailer(true);
    $mail->isSMTP();

    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "your_mail@gmail.com";
    $mail->Password = "your_password";
    $mail->SMTPSecure = "ssl";
    $mail->Port = "465";
    $mail->isHTML(true);

    $mail->setFrom("your_mail@gmail.com");

    function sendMail($to, $status, $productName){
        global $mail;
        try{
            $mail->addAddress($to);
            $mail->Subject = "Tech WebShop Order";
            if($status === "confirmed"){
                $mail->Body = "<h1>APPROVED</h1><br><strong>Your order of product: <h2>".$productName."</h2> is out for delivery.</strong>";
                $mail->send();
            }
            else{
                $mail->Body = "<h1>DECLINED</h1><br><strong>Your order of product: <h2>".$productName."</h2> is declined.</strong>";
                $mail->send();
            }
        }
        catch(Exception $e){}
    }
?>