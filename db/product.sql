CREATE TABLE IF NOT EXISTS product(
	id CHAR(13),
    product_name VARCHAR(50) NOT NULL,
    image_path VARCHAR(40),
    price DECIMAL(7, 2) NOT NULL,
    product_type VARCHAR(16) 
		CHECK (product_type in ('desktop computer', 'laptop', 'monitor',
        'headphones', 'mouse', 'keyboard', 'mousepad')),
	brand VARCHAR(6)
		CHECK (brand in ('asus', 'acer', 'lenovo', 'hp', 'msi', 'razer', 'other')),
	specifications VARCHAR(520),
    current_amount INTEGER,
    
    CONSTRAINT prkey_product_id PRIMARY KEY(id)
)