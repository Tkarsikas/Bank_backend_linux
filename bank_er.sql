-- MySQL Workbench Synchronization
-- Generated: 2026-02-02 00:39
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: karsi

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER SCHEMA `bank_db`  DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci ;

ALTER TABLE `bank_db`.`customer` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `bank_db`.`card` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `bank_db`.`account` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `bank_db`.`transaction` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `bank_db`.`card_account` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
DROP INDEX `card-card_account` ;
;

ALTER TABLE `bank_db`.`account_customer` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
CHANGE COLUMN `idaccount_customer` `idaccount_customer` INT(11) NULL DEFAULT NULL AUTO_INCREMENT ;


USE `bank_db`;
DROP procedure IF EXISTS `bank_db`.`customerData`;

DELIMITER $$
USE `bank_db`$$
CREATE PROCEDURE customerData(in id INT)
BEGIN
SELECT 
idcustomer,
fname,
lname,
street_address,
city,
idaccount,
balance,
account_type,
credit_limit,
idowner
from account_customer ac
JOIN customer c on ac.customer_id=idcustomer
JOIN account a on ac.account_id=idaccount
WHERE idcustomer=id;
END$$

DELIMITER ;

USE `bank_db`;
DROP procedure IF EXISTS `bank_db`.`accountData`;

DELIMITER $$
USE `bank_db`$$
CREATE PROCEDURE `accountData` (in id char(16))
BEGIN
SELECT 
idaccount,
balance, account_type, credit_limit,
idowner, idcustomer, fname,
lname, street_address, city
from account_customer ac
JOIN customer c on ac.customer_id=idcustomer
JOIN account a on ac.account_id=idaccount
WHERE idaccount=id;
END$$

DELIMITER ;

USE `bank_db`;
DROP procedure IF EXISTS `bank_db`.`withdraw`;

DELIMITER $$
USE `bank_db`$$
CREATE PROCEDURE `withdraw` (
IN amount DECIMAL(15,2), IN account_id  CHAR(16))
BEGIN
DECLARE v_balance DECIMAL(15,2);
DECLARE v_type ENUM('CREDIT', 'DEBIT'); 
DECLARE v_limit DECIMAL(15,2);

IF amount < 0 THEN
	SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'NOSTO SUMMA EI VOI OLLA NEGATIIVINEN';
END IF;

SELECT balance, credit_limit, account_type 
INTO v_balance, v_limit, v_type
FROM account
WHERE idaccount=account_id
FOR UPDATE;
    
IF v_type IS NULL THEN
	SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'TILIÄ EI LÖYDY';
END IF;

CASE
	WHEN v_type = 'DEBIT' THEN
		IF v_balance >= amount THEN
			UPDATE account
			SET balance = balance - amount
			WHERE idaccount = account_id;
		ELSEIF v_balance < amount THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'KATE EI RIITÄ';
		END IF;
    
    WHEN v_type = 'CREDIT' THEN
		IF v_balance >= amount THEN
			UPDATE account
			SET balance = balance - amount
			WHERE idaccount = account_id;
		ELSEIF v_balance < amount THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'LUOTTORAJA YLITTYY';
		END IF;
	END CASE;
END;$$

DELIMITER ;

USE `bank_db`;
DROP procedure IF EXISTS `bank_db`.`deposit`;

DELIMITER $$
USE `bank_db`$$
CREATE PROCEDURE `deposit` (
IN amount DECIMAL(15,2), IN account_id CHAR(16))

BEGIN
DECLARE v_balance DECIMAL(15,2);
DECLARE v_type ENUM('CREDIT', 'DEBIT');

IF amount < 0 THEN
	SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'ET VOI TALLETTAA NEGATIIVISTA LUKUA';
END IF;

SELECT balance, account_type, credit_limit
INTO v_balance, v_type, v_limit 
FROM account 
WHERE idaccount = account_id
FOR UPDATE;


IF v_type IS NULL THEN
	SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'TILIÄ EI LÖYDY';
ELSEIF v_type = 'DEBIT' THEN
	UPDATE account SET balance= balance+amount
	WHERE idaccount = account_id;
ELSEIF v_type = 'CREDIT' THEN
		UPDATE account SET balance = balance+amount
        WHERE idaccount = account_id;
END IF;
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
