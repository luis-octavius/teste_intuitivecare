import csv
import zipfile as ZipFile

import pandas as pd

from constants import DOWNLOAD_DIR


def parse_csv(csv_files_path, output_file="./consolidado_despesas.csv"):
    dfs = []

    for file in csv_files_path:
        trimester = file.split("/")[-1][0]
        try:
            df = pd.read_csv(
                file,
                sep=";",
                decimal=",",
                encoding="utf-8",
                dtype={
                    "REG_ANS": str,
                    "CD_CONTA_CONTABIL": str,
                    "VL_SALDO_INICIAL": float,
                    "VL_SALDO_FINAL": float,
                },
                parse_dates=["DATA"],
            )

            df["TRIMESTRE"] = trimester
            dfs.append(df)

        except Exception as e:
            print(f"Erro ao processar arquivo {file}: {e}")

    if not dfs:
        raise ValueError("Nenhum arquivo csv encontrado")

    df_final = pd.concat(dfs, ignore_index=True)

    df_final.sort_values(["DATA", "REG_ANS", "CD_CONTA_CONTABIL"], inplace=True)

    df_final.to_csv(output_file, sep=";", index=False, encoding="utf-8")

    zip_file(output_file, "consolidado_despesas.zip")
    print(f"Arquivo salvo como: {output_file}")
    print(f"Total de registros: {len(df_final):,}")

    return df_final


def zip_file(file, file_name):
    with ZipFile.ZipFile(file_name, "w") as zipf:
        zipf.write(file)
