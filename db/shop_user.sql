CREATE TABLE IF NOT EXISTS shop_user(
	username VARCHAR(30),
    user_password CHAR(60) NOT NULL,
    
    CONSTRAINT prkey_shop_user_username PRIMARY KEY(username)
)