import csv

csv_path = 'C:/Users/Razer/Dissertation/FinalProject/db/data/allData.csv'
output_csv_file = 'C:/Users/Razer/Dissertation/FinalProject/db/data/outputOverall.csv'

# Open the CSV file
with open(csv_path, 'r', newline='') as infile, open(output_csv_file, 'w', newline='') as outfile:
    csv_reader = csv.reader(infile)
    csv_writer = csv.writer(outfile)

    for row in csv_reader:
        # Clean up the row
        cleaned_row = ['NULL' if field == '' else field for field in row]

        # Check if any of the relevant fields for the stars calculation contain a dash
        if '-' in (cleaned_row[13], cleaned_row[14], cleaned_row[15], cleaned_row[16], cleaned_row[17]):
            continue  # Skip this row

        try:
            # Calculate the average of 'fourStar,' 'threeStar,' 'twoStar,' 'oneStar', and 'unclassified'
            stars = [float(cleaned_row[13]), float(cleaned_row[14]), float(cleaned_row[15]), float(cleaned_row[16]), float(cleaned_row[17])]
            average_score = sum(star * weight for star, weight in zip(stars, range(4, -1, -1))) / 100
            average_score = '{:.2f}'.format(average_score)
        except ValueError:
            # Skip the row if there's an error converting to float (this should not happen with the dash check)
            continue

        # Append the average score to the row
        cleaned_row.append(str(average_score))

        # Write the cleaned row to the output CSV file
        csv_writer.writerow(cleaned_row)
