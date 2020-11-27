import pickle
from pathlib import Path

import pandas as pd
import os

project_dir = Path(os.getcwd()).parent


def get_anomalies(index, threshold):
    filename = str(project_dir) + os.path.sep + "resources" + os.path.sep + "column_" + str(index) + "_loss"
    df = pd.read_pickle(filename)

    df = df[~df.index.duplicated(keep='first')]

    df['threshold'] = float(threshold)
    df['anomaly'] = df['loss'] > df['threshold']

    df.columns = ['in', 'loss', 'threshold', 'anomaly']
    df.index.names = ['date']

    return df[df['anomaly'] == True]

# print(os.getcwd())
# print(get_anomalies(0, 0.25))
