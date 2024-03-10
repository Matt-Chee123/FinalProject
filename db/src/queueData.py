import boto3
import csv
import json

# Initialize SQS client
sqs = boto3.client('sqs')
queue_url = 'https://sqs.eu-north-1.amazonaws.com/742600926264/projQueue'

# Open your CSV file
with open('C:/Users/Razer/Dissertation/FinalProject/db/data/incomeDataUoA12-23.csv', 'r', encoding='utf-8') as csvfile:
    csvreader = csv.DictReader(csvfile)
    for row in csvreader:
        # Convert the row to a JSON string
        message_body = json.dumps(row)
        # Send the message to SQS
        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=message_body
        )
        print(f"Enqueued record: {response['MessageId']}")
