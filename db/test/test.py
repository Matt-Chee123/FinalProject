import json

# Load JSON data
with open('data.json', 'r') as file:
    data = json.load(file)

# Extract and sort the relevant information
sorted_data = sorted(data, key=lambda x: x['UniversityName'])

# Create a list containing only UniversityName and InstitutionID
sorted_universities = [{'UniversityName': item['UniversityName'], 'InstitutionID': item['InstitutionID']} for item in sorted_data]

# Output the sorted list to a new JSON file
with open('sorted_universities.json', 'w') as outfile:
    json.dump(sorted_universities, outfile, indent=4)

print("Outputted sorted data to 'sorted_universities.json'")
