import csv
import os
import zipfile as ZipFile

import pandas as pd

from constants import DOWNLOAD_DIR


def parse_csv(csv_files_path, output_file="./consolidado_despesas.csv"):
    dfs = []

    for file in csv_files_path:
        filename = os.path.basename(file)
        trimester = None
        year = 2025

        if "T1" in filename or "1T" in filename:
            trimester = 1
        if "T2" in filename or "2T" in filename:
            trimester = 2
        if "T3" in filename or "3T" in filename:
            trimester = 3
        if "T4" in filename or "4T" in filename:
            trimester = 4

        df = pd.read_csv(file, sep=";", encoding="utf-8")

        if "VL_SALDO_INICIAL" in df.columns:
            df["VL_SALDO_INICIAL"] = (
                df["VL_SALDO_INICIAL"]
                .astype(str)
                .str.replace(".", "")
                .str.replace(",", ".")
                .astype(float)
            )
        if "VL_SALDO_FINAL" in df.columns:
            df["VL_SALDO_FINAL"] = (
                df["VL_SALDO_FINAL"]
                .astype(str)
                .replace(".", "")
                .str.replace(",", ".")
                .astype(float)
            )

        df["VALOR_DESPESAS"] = df["VL_SALDO_FINAL"] - df["VL_SALDO_INICIAL"]

        data = {
            "REG_ANS": df["REG_ANS"] if "REG_ANS" in df.columns else "",
            "CD_CONTA_CONTABIL": df["CD_CONTA_CONTABIL"]
            if "CD_CONTA_CONTABIL" in df.columns
            else "",
            "ANO": year,
            "TRIMESTRE": trimester,
            "VALOR_DESPESAS": df["VALOR_DESPESAS"],
        }

        consolidated_df = pd.DataFrame(data)
        dfs.append(consolidated_df)

    df_final = pd.concat(dfs, ignore_index=True)

    df_final.to_csv(output_file, sep=";", index=False, encoding="utf-8")

    zip_file(output_file, "consolidado_despesas.zip")


def zip_file(file, file_name):
    with ZipFile.ZipFile(file_name, "w") as zipf:
        zipf.write(file)
        print(f"File {file} zipped successfully as {file_name}")
