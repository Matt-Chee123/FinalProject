# Define a master dictionary to hold all unique universities and their coordinates
master_universities_coordinates = {}

# Define the filenames of the .py files containing the dictionaries
file_names = ['uniCoordsCS.py', 'UniCoordsClin.py', 'UniCoordsLaw.py']

for file_name in file_names:
    # Dynamically import the current file's dictionary
    # Note: Make sure these files are in the same directory as this script, or adjust the path accordingly
    file_dict = {}
    with open(file_name) as file:
        exec(file.read(), {}, file_dict)
    universities_coordinates = file_dict['universities_coordinates']

    # Update the master dictionary with the current file's universities
    # This automatically handles duplicates, as dictionary keys are unique
    master_universities_coordinates.update(universities_coordinates)

# Optionally, you can print or save the master dictionary to a new file
print(master_universities_coordinates)

# If you want to save it to a file, you can do something like this:
with open('universities_coordinates.py', 'w') as file:
    file.write("universities_coordinates = {\n")
    for uni, coords in master_universities_coordinates.items():
        file.write(f'    "{uni}": {coords},\n')
    file.write("}\n")