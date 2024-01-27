<?php

$db_host = "MattChee.mysql.pythonanywhere-services.com";
$db_user = "MattChee";
$db_pass = "200Argyle!!";
$db_name = "MattChee$default";

$db_connection = mysqli_connect($db_host, $db_user, $db_pass,$db_name);

if (mysqli_connect_errno()) {
	echo "Error: " . mysqli_connect_error() . "\n";
	exit;
}
$sql = "CREATE TABLE IF NOT EXISTS refData (
          InstitutionCode VARCHAR(8) NOT NULL,
          InstitutionName VARCHAR(255) NOT NULL,
          InstitutionSortOrder INT NOT NULL,
          MainPanel CHAR(1) NOT NULL,
          UnitOfAssessmentNumber INT NOT NULL,
          UnitOfAssessmentName VARCHAR(255) NOT NULL,
          MultipleSubmissionLetter CHAR(1),
          MultipleSubmissionName VARCHAR(255),
          JointSubmission VARCHAR(255),
          Profile VARCHAR(50) NOT NULL,
          FTEOfSubmittedStaff DECIMAL(10,2) NOT NULL,
          TotalFTEOfSubmittedStaffForJointSubmission DECIMAL(10,2) NULL,
          PercentOfEligibleStaffSubmitted DECIMAL(5,2) NOT NULL,
          Star4 DECIMAL(5,2) NOT NULL,
          Star3 DECIMAL(5,2) NOT NULL,
          Star2 DECIMAL(5,2) NOT NULL,
          Star1 DECIMAL(5,2) NOT NULL,
          Unclassified DECIMAL(5,2) NOT NULL,
          Latitude DECIMAL(10,8) NOT NULL,
          Longitude DECIMAL(11,8) NOT NULL,
          PRIMARY KEY (InstitutionCode, UnitOfAssessmentNumber, Profile)
)";

$result = mysqli_query($db_connection, $sql);
if (!$result) {
  echo "Error: " . mysqli_error($db_connection) . "\n";
  exit;
}
echo "Table refData created successfully\n";
mysqli_close($db_connection);

?>