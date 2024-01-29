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
        update_expression = 'SET IncomeSource = :source'
        expression_attribute_values = {
            ':source': row['Income source']
        }
        # Update the item in DynamoDB based on the Institution UKPRN code
        response = table.update_item(
            Key={
                'InstitutionID': row['Institution UKPRN code'] + "#" + row['Income source'],  # Partition key
                'UniversityName': row['Institution name']  # Sort key
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )
