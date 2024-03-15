import boto3
import csv

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('projDB-main')

with open('../data/incomeDataClin.csv', 'r') as csvfile:
    csvreader = csv.DictReader(csvfile)

    for row in csvreader:
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
        response = table.put_item(Item=item)
