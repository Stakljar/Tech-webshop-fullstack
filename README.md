# Tech-webshop
Webshop project made using React and PHP.
## How to run
To run application you will need to start backend server on port 3000, MySQL server on port 3306 and client server on port other than 3000 and 3306.<br>
For starting MySQL server you will need to use parameters defined in connection.php file which is located inside /server/db_conn directory and to setup database you will need to create database named tech_webshop and inside that database execute sql file that is located inside db directory called tech_webshop.sql.<br>
After that navigate to the client directory and execute following commands:
```cmd
npm install -f
npm start
```
You will need to use PHPMailer library for sending e-mails.
