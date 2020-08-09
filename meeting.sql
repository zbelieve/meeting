/*
Navicat MySQL Data Transfer

Source Server         : root
Source Server Version : 50645
Source Host           : localhost:3306
Source Database       : meeting

Target Server Type    : MYSQL
Target Server Version : 50645
File Encoding         : 65001

Date: 2020-08-09 20:59:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `meeting`
-- ----------------------------
DROP TABLE IF EXISTS `meeting`;
CREATE TABLE `meeting` (
  `m_uuid` char(50) NOT NULL DEFAULT '',
  `m_name` varchar(50) DEFAULT NULL,
  `m_content` varchar(300) DEFAULT NULL,
  `m_person` varchar(50) DEFAULT NULL,
  `m_type` int(10) DEFAULT NULL,
  `m_meetingid` varchar(50) DEFAULT NULL,
  `m_meetingurl` varchar(100) DEFAULT NULL,
  `m_createtime` timestamp NULL DEFAULT NULL,
  `m_meetingtime` timestamp NULL DEFAULT NULL,
  `m_details` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`m_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of meeting
-- ----------------------------
INSERT INTO `meeting` VALUES ('1', '开营培训', 'xx', '某技术骨干', '0', '1231231', 'http:', '2020-08-17 16:02:07', '2020-08-05 16:02:12', 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
INSERT INTO `meeting` VALUES ('2', 'xx', 'xx', 'xx', '1', '3', '33', '2020-07-21 16:02:35', '2020-08-11 16:02:42', 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
