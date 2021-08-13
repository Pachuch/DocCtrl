-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 13, 2021 at 01:32 PM
-- Server version: 5.5.48
-- PHP Version: 5.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `Approver`
--

CREATE TABLE IF NOT EXISTS `Approver` (
  `ApproverID` int(11) NOT NULL,
  `Number` int(11) NOT NULL,
  `Fullname` varchar(100) NOT NULL,
  `Position` varchar(100) DEFAULT NULL,
  `Status` varchar(32) NOT NULL,
  `ApproveDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Clause`
--

CREATE TABLE IF NOT EXISTS `Clause` (
  `ClauseID` int(11) NOT NULL,
  `Number` int(11) NOT NULL,
  `Body` mediumtext NOT NULL,
  `Performers` varchar(200) DEFAULT NULL,
  `Status` varchar(32) NOT NULL,
  `ExpirationDate` date DEFAULT NULL,
  `ReportID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `File`
--

CREATE TABLE IF NOT EXISTS `File` (
  `FileID` int(11) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `Path` varchar(200) NOT NULL,
  `Type` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Record`
--

CREATE TABLE IF NOT EXISTS `Record` (
  `RecordID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `UserFullName` varchar(100) DEFAULT NULL,
  `Number` varchar(40) DEFAULT NULL,
  `Header` text,
  `Basis` mediumtext,
  `Performer` varchar(100) DEFAULT NULL,
  `Category` varchar(32) NOT NULL,
  `Kind` varchar(32) NOT NULL,
  `DocumentDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `ChangeDate` datetime NOT NULL,
  `Status` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `RecordApprover`
--

CREATE TABLE IF NOT EXISTS `RecordApprover` (
  `RecordID` int(11) NOT NULL,
  `ApproverID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `RecordClause`
--

CREATE TABLE IF NOT EXISTS `RecordClause` (
  `RecordID` int(11) NOT NULL,
  `ClauseID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `RecordFile`
--

CREATE TABLE IF NOT EXISTS `RecordFile` (
  `RecordID` int(11) NOT NULL,
  `FileID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `RecordOwner`
--

CREATE TABLE IF NOT EXISTS `RecordOwner` (
  `RecordID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Report`
--

CREATE TABLE IF NOT EXISTS `Report` (
  `ReportID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Header` text NOT NULL,
  `ChangeDate` datetime NOT NULL,
  `FileID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(45) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `Fullname` varchar(100) NOT NULL,
  `Position` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Access` varchar(20) NOT NULL,
  `RegistrationDate` date NOT NULL,
  `Deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Approver`
--
ALTER TABLE `Approver`
  ADD PRIMARY KEY (`ApproverID`);

--
-- Indexes for table `Clause`
--
ALTER TABLE `Clause`
  ADD PRIMARY KEY (`ClauseID`),
  ADD KEY `clause_ibfk_1` (`ReportID`);

--
-- Indexes for table `File`
--
ALTER TABLE `File`
  ADD PRIMARY KEY (`FileID`);

--
-- Indexes for table `Record`
--
ALTER TABLE `Record`
  ADD PRIMARY KEY (`RecordID`),
  ADD KEY `record_ibfk_1` (`UserID`);

--
-- Indexes for table `RecordApprover`
--
ALTER TABLE `RecordApprover`
  ADD KEY `RecordID` (`RecordID`),
  ADD KEY `ApproverID` (`ApproverID`);

--
-- Indexes for table `RecordClause`
--
ALTER TABLE `RecordClause`
  ADD KEY `recordclause_ibfk_1` (`RecordID`),
  ADD KEY `recordclause_ibfk_2` (`ClauseID`);

--
-- Indexes for table `RecordFile`
--
ALTER TABLE `RecordFile`
  ADD KEY `recordfile_ibfk_1` (`RecordID`),
  ADD KEY `recordfile_ibfk_2` (`FileID`);

--
-- Indexes for table `RecordOwner`
--
ALTER TABLE `RecordOwner`
  ADD KEY `RecordID` (`RecordID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Report`
--
ALTER TABLE `Report`
  ADD PRIMARY KEY (`ReportID`),
  ADD KEY `report_ibfk_1` (`FileID`),
  ADD KEY `report_ibfk_2` (`UserID`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Approver`
--
ALTER TABLE `Approver`
  MODIFY `ApproverID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Clause`
--
ALTER TABLE `Clause`
  MODIFY `ClauseID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `File`
--
ALTER TABLE `File`
  MODIFY `FileID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Record`
--
ALTER TABLE `Record`
  MODIFY `RecordID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Report`
--
ALTER TABLE `Report`
  MODIFY `ReportID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Clause`
--
ALTER TABLE `Clause`
  ADD CONSTRAINT `clause_ibfk_1` FOREIGN KEY (`ReportID`) REFERENCES `Report` (`ReportID`);

--
-- Constraints for table `Record`
--
ALTER TABLE `Record`
  ADD CONSTRAINT `record_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`);

--
-- Constraints for table `RecordApprover`
--
ALTER TABLE `RecordApprover`
  ADD CONSTRAINT `recordapprover_ibfk_1` FOREIGN KEY (`RecordID`) REFERENCES `Record` (`RecordID`),
  ADD CONSTRAINT `recordapprover_ibfk_2` FOREIGN KEY (`ApproverID`) REFERENCES `Approver` (`ApproverID`);

--
-- Constraints for table `RecordClause`
--
ALTER TABLE `RecordClause`
  ADD CONSTRAINT `recordclause_ibfk_1` FOREIGN KEY (`RecordID`) REFERENCES `Record` (`RecordID`),
  ADD CONSTRAINT `recordclause_ibfk_2` FOREIGN KEY (`ClauseID`) REFERENCES `Clause` (`ClauseID`);

--
-- Constraints for table `RecordFile`
--
ALTER TABLE `RecordFile`
  ADD CONSTRAINT `recordfile_ibfk_1` FOREIGN KEY (`RecordID`) REFERENCES `Record` (`RecordID`),
  ADD CONSTRAINT `recordfile_ibfk_2` FOREIGN KEY (`FileID`) REFERENCES `File` (`FileID`);

--
-- Constraints for table `RecordOwner`
--
ALTER TABLE `RecordOwner`
  ADD CONSTRAINT `recordowner_ibfk_1` FOREIGN KEY (`RecordID`) REFERENCES `Record` (`RecordID`),
  ADD CONSTRAINT `recordowner_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`);

--
-- Constraints for table `Report`
--
ALTER TABLE `Report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`FileID`) REFERENCES `File` (`FileID`),
  ADD CONSTRAINT `report_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
