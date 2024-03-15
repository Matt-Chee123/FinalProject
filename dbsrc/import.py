import csv
import boto3
from decimal import Decimal
from botocore.exceptions import ClientError

HEADERS = [
    'InstitutionId',
    'UniversityName',
    'InstSortOrder',
    'MainPanel',
    'UnitOfAssessmentNum',
    'UnitOfAssessmentName',
    'MultiSubLetter',
    'MultiSubName',
    'JointSub',
    'ProfileType',
    'FTEOfSubmittedStaff',
    'TotalFTEJointSub',
    'PercEligibleStaff',
    'FourStar',
    'ThreeStar',
    'TwoStar',
    'OneStar',
    'Unclassified',
    'AverageScore'
]

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('projDbNew')
print('Table status:', table.table_status)
def create_primary_key(institution_id, profile_type):
    return f"{institution_id}#{profile_type}"

def put_item_if_not_exists(table, item):
    try:
        response = table.put_item(
            Item=item,
            ConditionExpression='attribute_not_exists(InstitutionID) AND attribute_not_exists(UofANumber)'
        )


        print(f"Successfully added record: {item['InstitutionID']}, {item['UofANumber']}")

    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            print(f"Item already exists: {item['InstitutionID']}, {item['UofANumber']}")
        else:
            print(f"Error inserting item: {e.response['Error']['Message']}")
            print(f"Failed to import record: {item['InstitutionID']}, {item['UofANumber']}")


try:
    with open('../data/outputOverall.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row_number, row in enumerate(reader, start=1):
            try:

                item_data = dict(zip(HEADERS, row))

                for key, value in item_data.items():
                    if value == 'NULL':
                        continue
                    if value.replace('.', '', 1).isdigit():
                        item_data[key] = Decimal(value)

                primary_key = create_primary_key(item_data['InstitutionId'], item_data['ProfileType'])

                item = {
                    'InstitutionID': primary_key,
                    'UniversityName': item_data['UniversityName'],
                    'InstSortOrder': item_data['InstSortOrder'],
                    'MainPanel': item_data['MainPanel'],
                    'UofANumber': item_data['UnitOfAssessmentNum'],
                    'UnitOfAssessmentName': item_data['UnitOfAssessmentName'],
                    'MultiSubLetter': item_data['MultiSubLetter'],
                    'MultiSubName': item_data['MultiSubName'],
                    'JointSub': item_data['JointSub'],
                    'ProfileType': item_data['ProfileType'],
                    'FTEOfSubmittedStaff': item_data['FTEOfSubmittedStaff'],
                    'TotalFTEJointSub': item_data['TotalFTEJointSub'],
                    'PercEligibleStaff': item_data['PercEligibleStaff'],
                    'FourStar': item_data['FourStar'],
                    'ThreeStar': item_data['ThreeStar'],
                    'TwoStar': item_data['TwoStar'],
                    'OneStar': item_data['OneStar'],
                    'Unclassified': item_data['Unclassified'],
                    'AverageScore': item_data['AverageScore']
                }

                put_item_if_not_exists(table, item)
            except ClientError as e:
                print(f"Error on row {row_number}: {e.response['Error']['Message']}")
                print(f"Failed to import record: {item}")
except UnicodeDecodeError as e:
    print(f"Encoding error in the file at row {row_number}: {e}")