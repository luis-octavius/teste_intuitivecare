import requests
import os


def get_data():
    download_url = "https://dadosabertos.ans.gov.br/FTP/PDA/operadoras_de_plano_de_saude_ativas/Relatorio_cadop.csv"
    filename = os.path.basename(download_url)
    response = requests.get(download_url)

