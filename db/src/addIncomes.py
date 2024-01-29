import boto3
import csv

# Initialize a DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('projDB-main')

# Open your CSV file with the new data
with open('../data/incomeData.csv', 'r') as csvfile:
    csvreader = csv.DictReader(csvfile)

    # Iterate over each row in the CSV
    for row in csvreader:
        # Construct the update expression and attribute values
        item = {
            'InstitutionID': row['Institution UKPRN code'] + "#" + row['Income source'],  # Partition key
            'UniversityName': row['Institution name'],  # Sort key
            'MainPanel': row['Main panel'],
            'UnitOfAssessmentNum': row['Unit of assessment number'],
            'UnitOfAssessmentName': row['Unit of assessment name'],
            'IncomeAcademicYear13_14': row['Income for academic year 2013-14'],
            'IncomeAcademicYear14_15': row['Income for academic year 2014-15'],
            'AverageIncome15_20': row['Average income for academic years 2015-16 to 2019-20'],
            'AverageIncome13_20': row['Average income for academic years 2013-14 to 2019-20'],
            'TotalIncome13_20': row['Total income for academic years 2013-14 to 2019-20']
        }
        # Update the item in DynamoDB based on the Institution UKPRN code
        response = table.put_item(Item=item)
