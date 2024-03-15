import boto3

dynamodb = boto3.resource('dynamodb')

table_name = 'projDB-main'
table = dynamodb.Table(table_name)

response = table.scan(ProjectionExpression="#k", ExpressionAttributeNames={"#k": "InstitutionID"})
items = response['Items']

for item in items:

    key = {"InstitutionID": item["InstitutionID"], "UniversityName": item["UniversityName"]}
    table.delete_item(Key=key)

print(f"Deleted {len(items)} items from {table_name}.")
