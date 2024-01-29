import boto3
from decimal import Decimal

# Initialize a session using Amazon DynamoDB
dynamodb = boto3.resource('dynamodb')

# Select your table
table = dynamodb.Table('projDB-main')

# Scan the table (note: use pagination in production code)
response = table.scan()

for item in response['Items']:
    update_expression = "SET "
    expression_attribute_values = {}

    # List of fields to check and convert
    fields = [
        'TotalIncome13_20', 'AverageIncome13_20',
        'AverageIncome15_20', 'IncomeAcademicYear13_14',
        'IncomeAcademicYear14_15'
    ]

    # Flag to check if update is needed
    update_needed = False

    for field in fields:
        # Check if the field exists
        if field in item:
            try:
                # Attempt to convert to number and prepare update expression and values
                converted_value = Decimal(item[field].replace(',', '').replace('$', '').strip())
                expression_attribute_values[f":val_{field}"] = converted_value
                update_expression += f"{field} = :val_{field}, "
                update_needed = True
            except ValueError as e:
                # Log the error and skip this field
                print(f"Error converting {field} for item with ID {item['InstitutionID']}: {e}")

    # If there are fields to update, proceed with the update_item call
    if update_needed:
        # Remove trailing comma and space from update expression
        update_expression = update_expression.rstrip(", ")

        # Update the item in the table with the new number attribute values
        try:
            table.update_item(
                Key={
                    'InstitutionID': item['InstitutionID'],  # Replace with your primary key
                    'UniversityName': item['UniversityName']  # Replace with your sort key if you have one
                },
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
        except Exception as e:
            # Handle potential exceptions from the update_item call
            print(f"Failed to update item with ID {item['InstitutionID']}: {e}")
