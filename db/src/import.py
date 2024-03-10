import csv
import boto3
from decimal import Decimal
from botocore.exceptions import ClientError

# Headers corresponding to your CSV structure. Modify as needed.
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

# Initialize a DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('projDbNew')  # Replace with your actual table name
print('Table status:', table.table_status)
# Function to create a primary key
def create_primary_key(institution_id, profile_type):
    return f"{institution_id}#{profile_type}"

def put_item_if_not_exists(table, item):
    try:
        # Attempt to put the item into the table
        response = table.put_item(
            Item=item,
            ConditionExpression='attribute_not_exists(InstitutionID) AND attribute_not_exists(UofANumber)'
        )

        # If the item is successfully added, print a success message.
        # We assume the operation was successful if we don't hit an exception.
        print(f"Successfully added record: {item['InstitutionID']}, {item['UofANumber']}")

    except ClientError as e:
        # If the item already exists, a ConditionalCheckFailedException is raised
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            print(f"Item already exists: {item['InstitutionID']}, {item['UofANumber']}")
        else:
            # For any other ClientError, print the error message and the problematic record
            print(f"Error inserting item: {e.response['Error']['Message']}")
            print(f"Failed to import record: {item['InstitutionID']}, {item['UofANumber']}")


# Open the CSV file and read each row
try:
    with open('../data/outputOverall.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row_number, row in enumerate(reader, start=1):  # Added row_number for reference
            try:

                # Map the row to the headers
                item_data = dict(zip(HEADERS, row))

                # Handle NULL values and convert strings that are actually numbers to Decimal
                for key, value in item_data.items():
                    if value == 'NULL':
                        continue  # Skip null values, DynamoDB does not store them
                    if value.replace('.', '', 1).isdigit():
                        item_data[key] = Decimal(value)

                # Create a primary key for each item
                primary_key = create_primary_key(item_data['InstitutionId'], item_data['ProfileType'])

                # Create the item to insert into DynamoDB
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

                # Insert the item into DynamoDB
                put_item_if_not_exists(table, item)
            except ClientError as e:
                # Print out the error and the problematic record
                print(f"Error on row {row_number}: {e.response['Error']['Message']}")
                print(f"Failed to import record: {item}")
except UnicodeDecodeError as e:
    print(f"Encoding error in the file at row {row_number}: {e}")