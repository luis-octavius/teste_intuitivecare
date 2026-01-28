from consume import download_files, get_files_url, get_html, get_last_year_url


def main():
    url = "https://dadosabertos.ans.gov.br/FTP/PDA/demonstracoes_contabeis/"

    page = get_html(url)

    build_url = get_last_year_url(page, url)

    years_page_html = get_html(build_url)

    files_url, files_name = get_files_url(years_page_html, build_url)

    download_files(files_url, files_name)


if __name__ == "__main__":
    main()
