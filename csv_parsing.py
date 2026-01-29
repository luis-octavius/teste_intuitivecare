import csv


def parse_csv(csv_files_path):
    for csv_file in csv_files_path:
        with open(csv_file, mode="r") as file:
            csv_file_read = csv.reader(file)
            for lines in csv_file_read:
                print(lines)
