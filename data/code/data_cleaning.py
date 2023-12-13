import csv

# Set the year you want to add to the data
year_to_add = "2022"

# copy from the webpage
raw_data = """

"""

# Split the data into lines and then into components
lines = raw_data.strip().split("\n")
rows = []
for line in lines:
    components = line.split("\t")
    # Convert the last component to float and add the year at the beginning
    components[-1] = float(components[-1])
    row = [year_to_add] + components
    rows.append(row)

# Write to CSV
with open("data.csv", "w", newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Year", "State", "Student_Group", "Value"])  # Write the header
    writer.writerows(rows)  # Write the data
