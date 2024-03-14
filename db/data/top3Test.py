import csv

def get_lowest_universities(csv_file_path, field_of_study, category, bottom_n=3):
    scores = []

    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)  # Skip header row
        for row in reader:
            university = row[1]
            study_field = row[5]
            entry_category = row[9]
            score = float(row[-1])

            if study_field == field_of_study and entry_category == category:
                scores.append((university, score))

    # Get bottom N universities based on score
    lowest_universities = sorted(scores, key=lambda x: x[1], reverse=False)[:bottom_n]

    return lowest_universities

# Example usage
csv_file_path = 'outputOverall.csv'
lowest_universities = get_lowest_universities(csv_file_path, 'Clinical Medicine', 'Overall', bottom_n=3)
for university, score in lowest_universities:
    print(f"{university}: {score}")
