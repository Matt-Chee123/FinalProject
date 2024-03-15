import csv

# The path to your CSV file
csv_file_path = 'incomeAll.csv'

# Set the desired Unit of Assessment as a parameter
desired_unit_of_assessment = "Sociology"

# Counter for records matching the desired Unit of Assessment
matching_records_count = 0

# Open the CSV file and read its contents
with open(csv_file_path, mode='r', encoding='utf-8') as file:
    csv_reader = csv.reader(file)

    # Skip the header row if your CSV has one
    next(csv_reader)

    # Loop through each row in the CSV
    for row in csv_reader:
        # Extract the unit of assessment name from the appropriate column
        unit_of_assessment = row[5]  # Assuming the 5th column contains the UoA

        # Check if the unit of assessment matches the desired one
        if unit_of_assessment == desired_unit_of_assessment:
            # Increment the counter for each matching record
            matching_records_count += 1

# Print the count of records matching the desired Unit of Assessment
print(f"Number of records for '{desired_unit_of_assessment}': {matching_records_count}")
