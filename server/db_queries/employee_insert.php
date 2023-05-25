<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
        session_start();
        $isAuthorized = false;
        if($_SESSION["authorized"]){
            $isAuthorized = true;
        }
        if(!$isAuthorized){
            echo
            "<form method='post'>
                <div>
                    <label for='security-password'>Security password</label>
                </div>
                <div>
                    <input id='security-password' name='security-password' type='password'>
                </div>
                <div>
                    <button type='submit' name='confirm-security-password'>Confirm</button>
                </div>
            </form>";
        }
        if(isset($_POST["confirm-security-password"])){
            if(password_verify($_POST["security-password"], file_get_contents("resources/security-password-hash.txt"))){
                $_SESSION["authorized"] = true;
                header("Location: http://localhost:3000/server/employee_insert.php");
            }
            else{
                echo "Invalid security password";
            }
        }
        if($isAuthorized){
            echo 
                "<form method='post'>
                    <div>
                        <label for='employee-username'>Employee username</label>
                    </div>
                    <div>
                        <input id='employee-username' name='employee-username' type='text'>
                    </div>
                    <div>
                        <label for='employee-password'>Employee password</label>
                    </div>
                    <div>
                        <input id='employee-password' name='employee-password' type='password'>
                    </div>
                    <div>
                        <button type='submit' name='add-employee'>Add</button>
                    </div>
                </form>";
        }
        if(isset($_POST["add-employee"])){
            if($_POST["employee-username"] !== "" && $_POST["employee-password"] !== ""){
                require_once "../db_conn/connection.php";
                require_once "../utils/db_components.php";
                $connection = getDBConnection();
                $statement = $connection->prepare("INSERT INTO $employee_table_name VALUES(?, ?)");
                $statement->bind_param("ss", $_POST["employee-username"], password_hash($_POST["employee-password"], PASSWORD_BCRYPT));
                try{
                    $statement->execute();
                    $statement->close();
                    $connection->close();
                    echo "Employee added";
                }
                catch(mysqli_sql_exception $e){
                    echo $e->getMessage();
                    $statement->close();
                    $connection->close();
                }
            }
            else{
                echo "Do not leave any input field blank";
            }
        }
    ?>
</body>
</html>