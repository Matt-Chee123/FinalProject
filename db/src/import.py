import csv
import boto3
from decimal import Decimal

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
table = dynamodb.Table('projDB')  # Replace with your actual table name

# Function to create a primary key
def create_primary_key(institution_id, profile_type):
    return f"{institution_id}#{profile_type}"

# Open the CSV file and read each row
with open('../../../UniversityWork/3rdYearProj/server/data/outputOverall.csv', 'r', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
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
            'PrimaryKey': primary_key,
            'UniversityName': item_data['UniversityName'],
            'InstSortOrder': item_data['InstSortOrder'],
            'MainPanel': item_data['MainPanel'],
            'UnitOfAssessmentNum': item_data['UnitOfAssessmentNum'],
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
        table.put_item(Item=item)
