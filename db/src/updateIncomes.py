import boto3
from decimal import Decimal
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('projDbNew')

sqs = boto3.client('sqs')
queue_url = 'https://sqs.eu-north-1.amazonaws.com/742600926264/projQueue'

while True:
    messages = sqs.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=10,
        WaitTimeSeconds=20
    )

    if 'Messages' in messages:
        for message in messages['Messages']:
            print("Raw message body:", message['Body'])
            row = json.loads(message['Body'])
            try:
                primary_key = {
                    'InstitutionID': row['Institution UKPRN code'] + "#" + row['Income source'],
                    'UofANumber': int(row['Unit of assessment number'])
                }
                update_expression = """
                SET MainPanel = :mainPanel,
                    UniversityName = :uniName,
                    UnitOfAssessmentNumber = :uoaNumber,
                    UnitOfAssessmentName = :uoaName,
                    MultipleSubmissionLetter = :multiSubLetter,
                    MultipleSubmissionName = :multiSubName,
                    JointSubmission = :jointSub,
                    IncomeSource = :source,
                    Income201314 = :income1314,
                    Income201415 = :income1415,
                    AverageIncome1520 = :avgIncome1520,
                    AverageIncome1320 = :avgIncome1320,
                    TotalIncome1320 = :totalIncome1320
                """
                expression_attribute_values = {
                    ':mainPanel': row['Main panel'],
                    ':uniName': row['Institution name'],
                    ':uoaNumber': row['Unit of assessment number'],
                    ':uoaName': row['Unit of assessment name'],
                    ':multiSubLetter': row['Multiple submission letter'],
                    ':multiSubName': row['Multiple submission name'],
                    ':jointSub': row['Joint submission'],
                    ':source': row['Income source'],
                    ':income1314': Decimal(row['Income for academic year 2013-14'].replace(',', '')) if row['Income for academic year 2013-14'] else Decimal('0'),
                    ':income1415': Decimal(row['Income for academic year 2014-15'].replace(',', '')) if row['Income for academic year 2014-15'] else Decimal('0'),
                    ':avgIncome1520': Decimal(row['Average income for academic years 2015-16 to 2019-20'].replace(',', '')) if row['Average income for academic years 2015-16 to 2019-20'] else Decimal('0'),
                    ':avgIncome1320': Decimal(row['Average income for academic years 2013-14 to 2019-20'].replace(',', '')) if row['Average income for academic years 2013-14 to 2019-20'] else Decimal('0'),
                    ':totalIncome1320': Decimal(row['Total income for academic years 2013-14 to 2019-20'].replace(',', '')) if row['Total income for academic years 2013-14 to 2019-20'] else Decimal('0'),
                }

                response = table.update_item(
                    Key=primary_key,
                    UpdateExpression=update_expression,
                    ExpressionAttributeValues=expression_attribute_values
                )
                sqs.delete_message(
                    QueueUrl=queue_url,
                    ReceiptHandle=message['ReceiptHandle']
                )
                print("Processed and deleted message:", message['MessageId'])
            except Exception as e:
                print(f"Error processing message {message['MessageId']}: {str(e)}")

