import boto3

# Initialize a Boto3 DynamoDB client
dynamodb = boto3.resource('dynamodb')

# Specify your table name
table_name = 'projDB-main'
table = dynamodb.Table(table_name)

# Placeholder for keys
keys = []

# Scan the table (Note: Consider using pagination for large tables)
response = table.scan(ProjectionExpression='InstitutionID, UniversityName')

items = response['Items']
for item in items:
    # Adjust the following line based on your table's key schema
    keys.append({'InstitutionID': item['InstitutionID'], 'UniversityName': item['UniversityName']})

# Function to split the keys list into chunks of 25
def chunked_list(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

# Split keys into chunks of 25 for batch processing
key_chunks = list(chunked_list(keys, 25))

for chunk in key_chunks:
    delete_requests = [{'DeleteRequest': {'Key': key}} for key in chunk]
    response = dynamodb.batch_write_item(RequestItems={table_name: delete_requests})

    # Handle unprocessed items due to potential throttling
    unprocessed_items = response.get('UnprocessedItems', {})
    while unprocessed_items:
        unprocessed = dynamodb.batch_write_item(RequestItems=unprocessed_items)
        unprocessed_items = unprocessed.get('UnprocessedItems', {})
