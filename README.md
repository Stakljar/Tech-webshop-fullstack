# Tech-webshop-fullstack
Webshop project made using React, PHP and MySQL/MariaDB.
## How to run
Clone the repository:
```cmd
git clone https://github.com/Stakljar/Tech-webshop.git
```
To run the application you will need to start backend server on port 3000, MySQL server on port 3306 and client server on port other than 3000 and 3306.<br>
For starting MySQL server you will need to use parameters defined in connection.php file which is located inside server/db_conn directory and to setup database you will need to execute sql file that is located inside db directory called tech_webshop.sql.<br>

Steps for database setup when using XAMPP:
1. Download and run XAMPP installer from: https://www.apachefriends.org/download.html
2. Open XAMPP Control Panel and enable Apache and MySQL
3. Params for MySQL/MariaDB server will be automatically set to the ones specified in _connection.php_
4. Click on Admin in MySQL section
5. In phpMyAdmin on database list click on "New"
6. Click on Import -> Choose File and select _tech_webshop.php_
7. After that click on Import

For starting PHP server you can use VSCode extension PHP Server by brapifra.
After installing extension right click on any PHP file and select PHP Server: Serve project.

For the client, navigate to the _client_ directory and execute following commands:
```cmd
npm install -f
npm start
```
You will need to use PHPMailer library for sending e-mails.
