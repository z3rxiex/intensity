-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2019 at 05:06 AM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bhutan_intdatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `intensity_data`
--

CREATE TABLE `intensity_data` (
  `id` int(11) NOT NULL,
  `MAC` varchar(45) NOT NULL DEFAULT '',
  `LogDate` date NOT NULL,
  `hr` smallint(6) NOT NULL DEFAULT '0',
  `PGV` decimal(5,1) NOT NULL DEFAULT '0.0',
  `PGA` decimal(5,1) NOT NULL DEFAULT '0.0',
  `MMI` decimal(5,1) NOT NULL DEFAULT '0.0',
  `UpdateCount` smallint(6) NOT NULL DEFAULT '0',
  `LatestLog` time NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Triggers `intensity_data`
--
DELIMITER $$
CREATE TRIGGER `intensity_data_insert` AFTER INSERT ON `intensity_data` FOR EACH ROW BEGIN
	
    IF NEW.hr = '0' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR0_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR0_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '1' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR1_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR1_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '2' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR2_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR2_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '3' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR3_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR3_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '4' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR4_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR4_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '5' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR5_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR5_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '6' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR6_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR6_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '7' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR7_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR7_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '8' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR8_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR8_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '9' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR9_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR9_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '10' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR10_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR10_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '11' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR11_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR11_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '12' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR12_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR12_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '13' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR13_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR13_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '14' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR14_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR14_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '15' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR15_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR15_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '16' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR16_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR16_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '17' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR17_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR17_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '18' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR18_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR18_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '19' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR19_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR19_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '20' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR20_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR20_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '21' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR21_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR21_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '22' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR22_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR22_id = NEW.ID, LatestLog = NEW.LatestLog;
    ELSEIF NEW.hr = '23' THEN
    	INSERT INTO intensity_main (MAC, LogDate, HR23_id, LatestLog) VALUES (NEW.MAC, NEW.LogDate, NEW.ID, NEW.LatestLog) 
        ON DUPLICATE KEY UPDATE HR23_id = NEW.ID, LatestLog = NEW.LatestLog;
    END IF;
   
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `intensity_log`
--

CREATE TABLE `intensity_log` (
  `id` int(11) NOT NULL,
  `YYYYMMDD` date NOT NULL,
  `HHMMSS` time NOT NULL,
  `MAC` text NOT NULL,
  `MMI` decimal(5,1) NOT NULL,
  `PGA` decimal(5,1) NOT NULL,
  `PGV` decimal(5,1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `intensity_main`
--

CREATE TABLE `intensity_main` (
  `id` int(11) NOT NULL,
  `MAC` varchar(45) NOT NULL DEFAULT '',
  `LogDate` date NOT NULL,
  `HR0_id` int(11) DEFAULT NULL,
  `HR1_id` int(11) DEFAULT NULL,
  `HR2_id` int(11) DEFAULT NULL,
  `HR3_id` int(11) DEFAULT NULL,
  `HR4_id` int(11) DEFAULT NULL,
  `HR5_id` int(11) DEFAULT NULL,
  `HR6_id` int(11) DEFAULT NULL,
  `HR7_id` int(11) DEFAULT NULL,
  `HR8_id` int(11) DEFAULT NULL,
  `HR9_id` int(11) DEFAULT NULL,
  `HR10_id` int(11) DEFAULT NULL,
  `HR11_id` int(11) DEFAULT NULL,
  `HR12_id` int(11) DEFAULT NULL,
  `HR13_id` int(11) DEFAULT NULL,
  `HR14_id` int(11) DEFAULT NULL,
  `HR15_id` int(11) DEFAULT NULL,
  `HR16_id` int(11) DEFAULT NULL,
  `HR17_id` int(11) DEFAULT NULL,
  `HR18_id` int(11) DEFAULT NULL,
  `HR19_id` int(11) DEFAULT NULL,
  `HR20_id` int(11) DEFAULT NULL,
  `HR21_id` int(11) DEFAULT NULL,
  `HR22_id` int(11) DEFAULT NULL,
  `HR23_id` int(11) DEFAULT NULL,
  `LatestLog` time NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `intstations`
--

CREATE TABLE `intstations` (
  `id` int(11) NOT NULL,
  `StnCode` varchar(4) NOT NULL,
  `StnName` varchar(50) NOT NULL,
  `MAC` varchar(17) NOT NULL,
  `Latitude` decimal(6,4) NOT NULL,
  `Longitude` decimal(7,4) NOT NULL,
  `Elevation` int(5) NOT NULL,
  `Dzongkhag` varchar(50) NOT NULL,
  `Gewog` varchar(50) NOT NULL,
  `Village` varchar(50) NOT NULL,
  `BldgName` varchar(50) NOT NULL,
  `DateInstalled` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `intensity_data`
--
ALTER TABLE `intensity_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hr_MAC_LogDate` (`hr`,`MAC`,`LogDate`);

--
-- Indexes for table `intensity_log`
--
ALTER TABLE `intensity_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `intensity_main`
--
ALTER TABLE `intensity_main`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MAC_LogDate` (`MAC`,`LogDate`) USING BTREE;

--
-- Indexes for table `intstations`
--
ALTER TABLE `intstations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `intensity_data`
--
ALTER TABLE `intensity_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `intensity_log`
--
ALTER TABLE `intensity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `intensity_main`
--
ALTER TABLE `intensity_main`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `intstations`
--
ALTER TABLE `intstations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
