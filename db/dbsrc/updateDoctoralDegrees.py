import boto3
import csv

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('projDbNew')

with open('../data/doctoralAll.csv', 'r') as csvfile:
    csvreader = csv.DictReader(csvfile)

    for row in csvreader:
        try:
            update_expression = 'SET DoctoralDegrees2013 = :dd2013, DoctoralDegrees2014 = :dd2014, DoctoralDegrees2015 = :dd2015, DoctoralDegrees2016 = :dd2016, DoctoralDegrees2017 = :dd2017, DoctoralDegrees2018 = :dd2018, DoctoralDegrees2019 = :dd2019'
            expression_attribute_values = {
                ':dd2013': row['Number of doctoral degrees awarded in academic year 2013'],
                ':dd2014': row['Number of doctoral degrees awarded in academic year 2014'],
                ':dd2015': row['Number of doctoral degrees awarded in academic year 2015'],
                ':dd2016': row['Number of doctoral degrees awarded in academic year 2016'],
                ':dd2017': row['Number of doctoral degrees awarded in academic year 2017'],
                ':dd2018': row['Number of doctoral degrees awarded in academic year 2018'],
                ':dd2019': row['Number of doctoral degrees awarded in academic year 2019']
            }

            response = table.update_item(
                Key={
                    'InstitutionID': row['Institution UKPRN code'] + "#Environment",
                    'UofANumber': int(row['Unit of assessment number'])
                },  # Sort key
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
        except Exception as e:
            print(f"Error updating item: {e}")
            print(f"Problematic record: {row}")
