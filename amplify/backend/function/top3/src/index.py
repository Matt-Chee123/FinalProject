import json
import boto3
from decimal import Decimal

# Initialize a boto3 DynamoDB client
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # Assuming your DynamoDB table's name is 'YourTableName'
    table = dynamodb.Table('projDB')

    # Scan the table - this can be expensive and slow for large tables
    try:
        response = table.scan()
        items = response['Items']

        # Sort items by 'AverageScore', which needs to be converted from Decimal
        sorted_items = sorted(items, key=lambda x: float(x['AverageScore']), reverse=True)[:3]

        # Convert from Decimal to float for JSON serialization
        for item in sorted_items:
            item['AverageScore'] = float(item['AverageScore'])

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(sorted_items)
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps("Error querying DynamoDB")
        }
