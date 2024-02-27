import boto3

# Initialize a DynamoDB resource
dynamodb = boto3.resource('dynamodb')

# Specify your table name
table_name = 'projDB-main'
table = dynamodb.Table(table_name)

# Scan the table for all items
response = table.scan(ProjectionExpression="#k", ExpressionAttributeNames={"#k": "InstitutionID"})
items = response['Items']

# Loop through the items and delete each one
for item in items:
    #key = {"InstitutionID": item["InstitutionID"]}
    # If your table uses a composite primary key (partition key and sort key),
    # you need to include both in the key, like this:
    key = {"InstitutionID": item["InstitutionID"], "UniversityName": item["UniversityName"]}
    table.delete_item(Key=key)

print(f"Deleted {len(items)} items from {table_name}.")
