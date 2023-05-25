CREATE TABLE IF NOT EXISTS product_transaction(
	id CHAR(13),
    user_username CHAR(13),
    product_id CHAR(13),
    recipient_name VARCHAR(30) NOT NULL,
	recipient_surname VARCHAR(40) NOT NULL,
	recipient_email VARCHAR(100) NOT NULL,
	recipient_phone VARCHAR(20) NOT NULL,
	recipient_address VARCHAR(150) NOT NULL,
	recipient_city VARCHAR(150) NOT NULL,
	recipient_zip VARCHAR(13) NOT NULL,
	recipient_country VARCHAR(60) NOT NULL,
    amount INTEGER NOT NULL,
    transaction_status VARCHAR(16) 
		CHECK (transaction_status in ('pending', 'confirmed', 'delivered')) DEFAULT 'pending',
	order_date VARCHAR(80) DEFAULT NULL,
    delivery_date VARCHAR(80) DEFAULT NULL,
    
    CONSTRAINT prkey_product_transaction_id PRIMARY KEY(id),
	CONSTRAINT frkey_product_transaction_user_username FOREIGN KEY(user_username) REFERENCES shop_user(username) ON UPDATE CASCADE ON DELETE SET NULL,
	CONSTRAINT frkey_product_transaction_product_id FOREIGN KEY(product_id) REFERENCES product(id) ON UPDATE CASCADE ON DELETE SET NULL
)