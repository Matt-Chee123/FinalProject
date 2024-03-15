import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('projDB-main')

response = table.scan()

for item in response['Items']:
    update_expression = "SET "
    expression_attribute_values = {}

    fields = [
        'TotalIncome13_20', 'AverageIncome13_20',
        'AverageIncome15_20', 'IncomeAcademicYear13_14',
        'IncomeAcademicYear14_15'
    ]

    update_needed = False
    for field in fields:
        if field in item:
            if isinstance(item[field], Decimal):
                continue
            try:
                if isinstance(item[field], str):
                    converted_value = Decimal(item[field].replace(',', '').replace('$', '').strip())
                    expression_attribute_values[f":val_{field}"] = converted_value
                    update_expression += f"{field} = :val_{field}, "
                    update_needed = True
            except ValueError as e:
                print(f"Error converting {field} for item with ID {item['InstitutionID']}: {e}")


    if update_needed:
        update_expression = update_expression.rstrip(", ")

        try:
            table.update_item(
                Key={
                    'InstitutionID': item['InstitutionID'],
                    'UniversityName': item['UniversityName']
                },
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
        except Exception as e:
            print(f"Failed to update item with ID {item['InstitutionID']}: {e}")
