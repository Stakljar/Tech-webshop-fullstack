DELIMITER **
CREATE TRIGGER TR_product_transaction_date BEFORE INSERT
ON product_transaction
FOR EACH ROW
	IF NEW.delivery_date IS NOT NULL AND NEW.transaction_status != 'delivered' THEN
		SIGNAL SQLSTATE '40002'
        SET MESSAGE_TEXT = 'Delivery date cannot be set if status is not changed from confirmed or pending';
	END IF;
**