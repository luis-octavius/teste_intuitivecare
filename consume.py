import os
import re

import requests
from bs4 import BeautifulSoup


def get_html(url):
    try:
        response = requests.get(url)

        if response.status_code == 200:
            return response.text
        else:
            print("Error: ", response.status_code)
            return None
    except Exception as e:
        print("Error: ", e)


def download_files(files, file_names):
    for i in range(0, len(files), 1):
        download = requests.get(files[i])
        file_path = os.path.join("./download", file_names[i])
        print("File path: ", file_path)

        if download.status_code == 200:
            with open(file_path, "wb") as file:
                file.write(download.content)
            print("File downloaded successfully")
        else:
            print("Failed to download file")


def get_files_url(html, url):
    soup = BeautifulSoup(html, "html.parser")

    table_rows = soup.find_all("a")

    files = []
    file_names = []

    for row in table_rows:
        str = row.string
        if re.search("(.zip)", str):
            file = os.path.join(url, str)
            files.append(file)
            file_names.append(str)

    return files, file_names


def get_last_year_url(html, url):
    soup = BeautifulSoup(html, "html.parser")

    table_rows = soup.find_all("a")

    year = extract_last_year(table_rows)
    print(year)

    build_url = url + year + "/"
    return build_url


def extract_last_year(table_rows):
    extracted_years = []

    for row in table_rows:
        str = row.string.replace("/", "")
        if re.search(r"\d", str):
            extracted_years.append(str)

    return extracted_years[-1:][0]
