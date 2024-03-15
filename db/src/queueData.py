import boto3
import csv
import json

sqs = boto3.client('sqs')
queue_url = 'https://sqs.eu-north-1.amazonaws.com/742600926264/projQueue'

with open('C:/Users/Razer/Dissertation/FinalProject/db/data/incomeDataUoA12-23.csv', 'r', encoding='utf-8') as csvfile:
    csvreader = csv.DictReader(csvfile)
    for row in csvreader:
        message_body = json.dumps(row)
        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=message_body
        )
        print(f"Enqueued record: {response['MessageId']}")
