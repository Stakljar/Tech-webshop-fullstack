CREATE TABLE IF NOT EXISTS employee(
	username VARCHAR(30) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_BIN,
    user_password CHAR(60) NOT NULL,
    
    CONSTRAINT prkey_employee_username PRIMARY KEY(username)
)

INSERT INTO employee VALUES("GG", "123")
INSERT INTO employee VALUES("BG", "123")

CREATE DATABASE mail_delivery