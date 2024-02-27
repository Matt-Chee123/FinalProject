import boto3
import csv

# Initialize a DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('dbProj')

# Open your CSV file with the new data
with open('../data/incomeDataClin.csv', 'r') as csvfile:
    csvreader = csv.DictReader(csvfile)

    # Iterate over each row in the CSV
    for row in csvreader:
        # Construct the update expression to include all fields
        update_expression = """
        SET MainPanel = :mainPanel,
            UniversityName = :uniName,
            UnitOfAssessmentNumber = :uoaNumber,
            UnitOfAssessmentName = :uoaName,
            MultipleSubmissionLetter = :multiSubLetter,
            MultipleSubmissionName = :multiSubName,
            JointSubmission = :jointSub,
            IncomeSource = :source,
            Income201314 = :income1314,
            Income201415 = :income1415,
            AverageIncome1520 = :avgIncome1520,
            AverageIncome1320 = :avgIncome1320,
            TotalIncome1320 = :totalIncome1320
        """

        # Map values from the CSV to the update expression attributes
        expression_attribute_values = {
            ':mainPanel': row['Main panel'],
            ':uniName': row['Institution name'],
            ':uoaNumber': row['Unit of assessment number'],
            ':uoaName': row['Unit of assessment name'],
            ':multiSubLetter': row['Multiple submission letter'],
            ':multiSubName': row['Multiple submission name'],
            ':jointSub': row['Joint submission'],
            ':source': row['Income source'],
            ':income1314': int(row['Income for academic year 2013-14'].replace(',', '')) if row['Income for academic year 2013-14'] else 0,
            ':income1415': int(row['Income for academic year 2014-15'].replace(',', '')) if row['Income for academic year 2014-15'] else 0,
            ':avgIncome1520': int(row['Average income for academic years 2015-16 to 2019-20'].replace(',', '')) if row['Average income for academic years 2015-16 to 2019-20'] else 0,
            ':avgIncome1320': int(row['Average income for academic years 2013-14 to 2019-20'].replace(',', '')) if row['Average income for academic years 2013-14 to 2019-20'] else 0,
            ':totalIncome1320': int(row['Total income for academic years 2013-14 to 2019-20'].replace(',', '')) if row['Total income for academic years 2013-14 to 2019-20'] else 0,
}

        # Update the item in DynamoDB based on the Institution UKPRN code
        response = table.update_item(
            Key={
                'InstitutionID': row['Institution UKPRN code'] + "#" + row['Income source'],  # Partition key
                'UofANumber': int(row['Unit of assessment number'])  # Sort key
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )
