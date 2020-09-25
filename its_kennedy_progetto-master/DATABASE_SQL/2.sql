-- MySQL Script generated by MySQL Workbench
-- Mon Aug 31 10:52:43 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ITS_KENNEDY
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ITS_KENNEDY` ;

-- -----------------------------------------------------
-- Schema ITS_KENNEDY
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ITS_KENNEDY` DEFAULT CHARACTER SET utf8 ;
USE `ITS_KENNEDY` ;

-- -----------------------------------------------------
-- Table `ITS_KENNEDY`.`HW`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ITS_KENNEDY`.`HW` ;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`HW` (
  `idHW` INT NOT NULL AUTO_INCREMENT,
  `Cpu` VARCHAR(45) NULL DEFAULT NULL,
  `Ram` INT NULL DEFAULT NULL,
  `Memoria` INT NULL DEFAULT NULL,
  `Tipo_memoria` VARCHAR(45) NULL DEFAULT NULL,
  `marca` VARCHAR(45) NULL DEFAULT NULL,
  `modello` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idHW`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ITS_KENNEDY`.`SEDE`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ITS_KENNEDY`.`SEDE` ;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`SEDE` (
  `idSEDE` INT NOT NULL AUTO_INCREMENT,
  `SEDE` VARCHAR(100) NULL,
  PRIMARY KEY (`idSEDE`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ITS_KENNEDY`.`STATO`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ITS_KENNEDY`.`STATO` ;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`STATO` (
  `idSTATO` INT NOT NULL AUTO_INCREMENT,
  `ritiro` TINYINT NULL,
  `consegna` TINYINT NULL,
  `guasto` TINYINT NULL,
  `riparazione` TINYINT NULL,
  `KO` TINYINT NULL,
  PRIMARY KEY (`idSTATO`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ITS_KENNEDY`.`PC`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ITS_KENNEDY`.`PC` ;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`PC` (
  `idpc` INT NOT NULL AUTO_INCREMENT,
  `HW_idHW` INT NOT NULL,
  `STATO_idSTATO` INT NOT NULL,
  `Seriale` VARCHAR(70) NOT NULL,
  `n_inventario` VARCHAR(45) NOT NULL,
  `n_fattura` VARCHAR(45) NOT NULL,
  `data_Acquisto` DATE NOT NULL,
  `note` VARCHAR(500) NULL DEFAULT NULL,
  `SEDE_idSEDE` INT NOT NULL,
  PRIMARY KEY (`idpc`),
  INDEX `fk_PC_HW_idx` (`HW_idHW` ASC) VISIBLE,
  INDEX `fk_PC_STATO1_idx` (`STATO_idSTATO` ASC) VISIBLE,
   INDEX `fk_PC_SEDE1_idx` (`SEDE_idSEDE` ASC) VISIBLE,
  CONSTRAINT `fk_PC_HW`
    FOREIGN KEY (`HW_idHW`)
    REFERENCES `ITS_KENNEDY`.`HW` (`idHW`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PC_STATO1`
    FOREIGN KEY (`STATO_idSTATO`)
    REFERENCES `ITS_KENNEDY`.`STATO` (`idSTATO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
     CONSTRAINT `fk_PC_SEDE1`
    FOREIGN KEY (`SEDE_idSEDE`)
    REFERENCES `ITS_KENNEDY`.`SEDE` (`idSEDE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ITS_KENNEDY`.`CORSO`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ITS_KENNEDY`.`CORSO` ;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`CORSO` (
  `idCORSO` INT NOT NULL AUTO_INCREMENT,
  `CORSO` VARCHAR(150) NULL,
  `SEDE_idSEDE` INT NOT NULL,
  PRIMARY KEY (`idCORSO`),
  INDEX `fk_CORSO_SEDE1_idx` (`SEDE_idSEDE` ASC) VISIBLE,
  CONSTRAINT `fk_CORSO_SEDE1`
    FOREIGN KEY (`SEDE_idSEDE`)
    REFERENCES `ITS_KENNEDY`.`SEDE` (`idSEDE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ITS_KENNEDY`.`UTENTE`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ITS_KENNEDY`.`UTENTE` ;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`UTENTE` (
  `idUTENTE` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(70) NULL DEFAULT NULL,
  `cognome` VARCHAR(70) NULL DEFAULT NULL,
  `data_nascita` DATE NULL DEFAULT NULL,
  `luogo_nascita` VARCHAR(70) NULL DEFAULT NULL,
  `via` VARCHAR(70) NULL DEFAULT NULL,
  `civico` VARCHAR(20) NULL DEFAULT NULL,
  `comune` VARCHAR(100) NULL DEFAULT NULL,
  `provincia_sigla` VARCHAR(4) NULL DEFAULT NULL,
  `frequentazione` TINYINT NULL DEFAULT NULL,
  `CORSO_idCORSO` INT NOT NULL,
  PRIMARY KEY (`idUTENTE`),
  INDEX `fk_UTENTE_CORSO1_idx` (`CORSO_idCORSO` ASC) VISIBLE,
  CONSTRAINT `fk_UTENTE_CORSO1`
    FOREIGN KEY (`CORSO_idCORSO`)
    REFERENCES `ITS_KENNEDY`.`CORSO` (`idCORSO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`MANUTENTORE`(
  `idMANUTENTORE` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(70) null DEFAULT NULL,
  `cognome` VARCHAR(70) NULL DEFAULT NULL,
  `via` VARCHAR(70) Null DEFAULT NULL,
  `civico`  VARCHAR(70) NULL DEFAULT NULL,
  `comune` VARCHAR(70) NULL DEFAULT NULL,
  `provincia_sigla`VARCHAR(70) NULL DEFAULT NULL,
  `ditta` VARCHAR(70) NULL DEFAULT NULL,
  `SEDE_idSEDE` INT NOT NULL,
  PRIMARY KEY (`idMANUTENTORE`),
   INDEX `fk_MANUTENTORE_SEDE1_idx` (`SEDE_idSEDE` ASC) VISIBLE,
  CONSTRAINT `fk_MANUTENTORE_SEDE1`
    FOREIGN KEY (`SEDE_idSEDE`)
    REFERENCES `ITS_KENNEDY`.`SEDE` (`idSEDE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `ITS_KENNEDY`.`ADMIN`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ITS_KENNEDY`.`ADMIN` ;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`ADMIN` (
  `idADMIN` INT NOT NULL AUTO_INCREMENT,
  `Nome_Admin` VARCHAR(50) NOT NULL,
  `Cognome_Admin` VARCHAR(50) NOT NULL,
  `Username` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(80) NOT NULL,
  `Password` VARCHAR(300) NOT NULL,
  `RUOLO` VARCHAR(100) NOT NULL,
  `Admin_Status` TINYINT(1) NOT NULL,
  PRIMARY KEY (`idADMIN`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ITS_KENNEDY`.`MOVIMENTO`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ITS_KENNEDY`.`MOVIMENTO` ;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`MOVIMENTO` (
  `idMOVIMENTO` INT NOT NULL AUTO_INCREMENT,
  `data_consegna` DATE NULL DEFAULT NULL,
  `cavo_rete` TINYINT NULL DEFAULT NULL,
  `alimentatore` TINYINT NULL DEFAULT NULL,
  `borsa` TINYINT NULL DEFAULT NULL,
  `mouse` TINYINT NULL DEFAULT NULL,
  `hdd` TINYINT NULL DEFAULT NULL,
  `con_ethernet` TINYINT NULL DEFAULT NULL,
  `con_usb` TINYINT NULL DEFAULT NULL,
  `note` VARCHAR(500) NULL DEFAULT NULL,
  `note_movimento` VARCHAR(200) NULL DEFAULT NULL,
  `PC_idpc` INT NOT NULL,
  `UTENTE_idUTENTE` INT NOT NULL,
  `ADMIN_idADMIN` INT NOT NULL,
  `STATO_idSTATO` INT  NOT NULL,
  PRIMARY KEY (`idMOVIMENTO`),
  INDEX `fk_MOVIMENTO_PC1_idx` (`PC_idpc` ASC) VISIBLE,
  INDEX `fk_MOVIMENTO_UTENTE1_idx` (`UTENTE_idUTENTE` ASC) VISIBLE,
  INDEX `fk_MOVIMENTO_ADMIN1_idx` (`ADMIN_idADMIN` ASC) VISIBLE,
  INDEX `fk_MOVIMENTO_STATO1_idx` (`STATO_idSTATO`ASC) VISIBLE,
  CONSTRAINT `fk_MOVIMENTO_PC1`
    FOREIGN KEY (`PC_idpc`)
    REFERENCES `ITS_KENNEDY`.`PC` (`idpc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_MOVIMENTO_UTENTE1`
    FOREIGN KEY (`UTENTE_idUTENTE`)
    REFERENCES `ITS_KENNEDY`.`UTENTE` (`idUTENTE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_MOVIMENTO_ADMIN1`
    FOREIGN KEY (`ADMIN_idADMIN`)
    REFERENCES `ITS_KENNEDY`.`ADMIN` (`idADMIN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_MOVIMENTO_STATO1`
  FOREIGN KEY (`STATO_idSTATO`)
  REFERENCES `ITS_KENNEDY`.`STATO`(`idSTATO`)
   ON DELETE NO ACTION
   ON UPDATE NO ACTION
    )
ENGINE = InnoDB;
DROP TABLE IF EXISTS `ITS_KENNEDY`.`MOVIMENTIMANUTENTORE`;
CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`MOVIMENTIMANUTENTORE`( 
  `idMOVIMENTO_MANUTENTORE` INT NOT NULL AUTO_INCREMENT,
  `data_consegna` DATE NULL DEFAULT NULL,
  `note` VARCHAR(500) NULL DEFAULT NULL,
  `note_movimento` VARCHAR(200) NULL DEFAULT NULL,
  `N_Fattura_Riparazione` VARCHAR(45) NOT NULL,
  `PC_idpc` INT NOT NULL,
  `ADMIN_idADMIN` INT NOT NULL,
  `STATO_idSTATO` INT  NOT NULL,
  `MANUTENTORE_idMANUTENTORE`INT NOT NULL,
   PRIMARY KEY (`idMOVIMENTO_MANUTENTORE`),
  INDEX `fk_MOVIMENTIMANUTENTORE_PC1_idx` (`PC_idpc` ASC) VISIBLE,
  INDEX `fk_MOVIMENTIMANUTENTORE_ADMIN1_idx` (`ADMIN_idADMIN` ASC) VISIBLE,
  INDEX `fk_MOVIMENTIMANUTENTORE_STATO1_idx` (`STATO_idSTATO`ASC) VISIBLE,
  INDEX `fk_MOVIMENTIMANUTENTORE_MANUTENTORE1_idx`(`MANUTENTORE_idMANUTENTORE`ASC) VISIBLE,
  CONSTRAINT `fk_MOVIMENTIMANUTENTORE_PC1`
    FOREIGN KEY (`PC_idpc`)
    REFERENCES `ITS_KENNEDY`.`PC` (`idpc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_MOVIMENTIMANUTENTORE_ADMIN1`
    FOREIGN KEY (`ADMIN_idADMIN`)
    REFERENCES `ITS_KENNEDY`.`ADMIN` (`idADMIN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_MOVIMENTIMANUTENTORE_STATO1`
  FOREIGN KEY (`STATO_idSTATO`)
  REFERENCES `ITS_KENNEDY`.`STATO`(`idSTATO`)
   ON DELETE NO ACTION
   ON UPDATE NO ACTION,
  CONSTRAINT `fk_MOVIMENTIMANUTENTORE_MANUTENTORE1`
  FOREIGN KEY (`MANUTENTORE_idMANUTENTORE`)
  REFERENCES `ITS_KENNEDY`.`MANUTENTORE`(`idMANUTENTORE`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ITS_KENNEDY`.`ADMIN_has_SEDE`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ITS_KENNEDY`.`ADMIN_has_SEDE` ;

CREATE TABLE IF NOT EXISTS `ITS_KENNEDY`.`ADMIN_has_SEDE` (
  `ADMIN_idADMIN` INT NOT NULL,
  `SEDE_idSEDE` INT NOT NULL,
  PRIMARY KEY (`ADMIN_idADMIN`, `SEDE_idSEDE`),
  INDEX `fk_ADMIN_has_SEDE_SEDE1_idx` (`SEDE_idSEDE` ASC) VISIBLE,
  INDEX `fk_ADMIN_has_SEDE_ADMIN1_idx` (`ADMIN_idADMIN` ASC) VISIBLE,
  CONSTRAINT `fk_ADMIN_has_SEDE_ADMIN1`
    FOREIGN KEY (`ADMIN_idADMIN`)
    REFERENCES `ITS_KENNEDY`.`ADMIN` (`idADMIN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ADMIN_has_SEDE_SEDE1`
    FOREIGN KEY (`SEDE_idSEDE`)
    REFERENCES `ITS_KENNEDY`.`SEDE` (`idSEDE`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;







SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
