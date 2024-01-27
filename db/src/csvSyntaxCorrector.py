import csv

csv_path = 'C:/Users/Razer/OneDrive/zY3 Uni/3rd year project/ThirdYearProject/db/data/data_withoutHeaders.csv'
output_csv_file = '../../../UniversityWork/3rdYearProj/server/data/outputOverall.csv'

# Open the CSV file
with open(csv_path, 'r', newline='') as infile, open(output_csv_file, 'w', newline='') as outfile:
    csv_reader = csv.reader(infile)
    csv_writer = csv.writer(outfile)

    # Set to keep track of unique values in column 2
    for row in csv_reader:
        # Check if the record is related to "Computer Science and Informatics"
        if 'Computer Science and Informatics' in row[5]:  # Assuming this is the correct column for the Unit of assessment name
            # Replace empty fields with 'NULL'
            cleaned_row = ['NULL' if field == '' else field for field in row]

            # Calculate the average of 'fourStar,' 'threeStar,' 'twoStar,' and 'oneStar'
            stars = [float(cleaned_row[13]), float(cleaned_row[14]), float(cleaned_row[15]), float(cleaned_row[16])]
            average_score = stars[0]/100 * 4 + stars[1]/100 * 3 + stars[2]/100 * 2 + stars[3]/100 * 1
            average_score = '{:.2f}'.format(average_score)

            # Append the average score to the row
            cleaned_row.append(str(average_score))

            # Write the cleaned row to the output CSV file
            csv_writer.writerow(cleaned_row)
