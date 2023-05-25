CREATE TABLE IF NOT EXISTS user(
	id CHAR(36),
	username VARCHAR(30) UNIQUE NOT NULL,
    user_password CHAR(56) NOT NULL,
    
    CONSTRAINT prkey_user_id PRIMARY KEY(id)
)