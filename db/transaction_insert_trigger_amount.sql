DELIMITER **
CREATE TRIGGER TR_product_transaction_amount BEFORE INSERT
ON product_transaction
FOR EACH ROW
	IF NEW.amount > (SELECT current_amount FROM product WHERE id = NEW.product_id LIMIT 1) THEN
		SET @output_text = CONCAT('Ordered amount is greater than the available amount of product in cart: ', (SELECT product_name FROM product WHERE id = NEW.product_id LIMIT 1));
		SIGNAL SQLSTATE '40001'
        SET MESSAGE_TEXT = @output_text;
	END IF;
**