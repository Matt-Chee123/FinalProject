import boto3

# Initialize a Boto3 DynamoDB client
dynamodb = boto3.resource('dynamodb')
client = boto3.client('dynamodb')
table = dynamodb.Table('projDbNew')
table_name = 'projDbNew'

# Function to create chunks of 25 items
def chunked_list(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

# Function to delete items in chunks of 25
def delete_all_items():
    # Pagination starts
    last_evaluated_key = None

    while True:
        # Scan with pagination
        scan_kwargs = {
            'ProjectionExpression': 'InstitutionID, UofANumber',
            'Limit': 100  # Lower this if you're getting throttled
        }
        if last_evaluated_key:
            scan_kwargs['ExclusiveStartKey'] = last_evaluated_key

        response = table.scan(**scan_kwargs)
        items = response.get('Items', [])

        # Prepare keys for deletion
        keys_to_delete = [{'InstitutionID': item['InstitutionID'], 'UofANumber': item['UofANumber']} for item in items]

        # Split keys into chunks of 25 for batch processing
        for chunk in chunked_list(keys_to_delete, 25):
            # Prepare the batch delete requests
            delete_requests = [{
                'DeleteRequest': {
                    'Key': {
                        'InstitutionID': {'S': key['InstitutionID']},  # DynamoDB expects the type declaration
                        'UofANumber': {'N': str(key['UofANumber'])}   # Convert the number to string for DynamoDB
                    }
                }
            } for key in chunk]

            # Perform the batch write operation
            batch_write_response = client.batch_write_item(RequestItems={table_name: delete_requests})

            # Handle unprocessed items, if any
            unprocessed_items = batch_write_response.get('UnprocessedItems', {})
            while unprocessed_items:
                retry_response = client.batch_write_item(RequestItems=unprocessed_items)
                unprocessed_items = retry_response.get('UnprocessedItems', {})

        # Check if the scan has reached the end of the table
        last_evaluated_key = response.get('LastEvaluatedKey')
        if not last_evaluated_key:
            break

# Call the function to start deletion
delete_all_items()
