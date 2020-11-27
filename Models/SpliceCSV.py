import numpy as np
import pandas as pd
from tensorflow import keras
import csv
from tensorflow.keras import layers
from matplotlib import pyplot as plt
import os
from datetime import datetime

# timestamp,Ttl Volume,Avg Volume,Ttl Through,Ttl Left Turn,Ttl Right Turn,Ttl Wrong Way,Overall Avg Speed, Zone 2, Zone 3, Zone 4, Zone 5, Zone 2.1, Zone 3.1, Zone 4.1, Zone 5.1,Class 1: 0-22ft,Class 2: 22-36ft,Class 3: 36-Up, , .1, 04 Eb Through #1, 04 Eb Through #3, 07 Eb Left Turn #1, 07 Eb Left Turn #2, 04 Eb Through #1.1, 04 Eb Through #3.1, 07 Eb Left Turn #1.1, 07 Eb Left Turn #2.1

root_dir = "C:\\Users\\Mark Fuller\\Desktop\\Senior\\DM\\traffic\\resources\\RawData\\"

print("Loading Data")
root_dirs = os.listdir(root_dir)
root_dirs = list(filter(lambda x: ("csv" in x), root_dirs))
print(str(root_dirs))

files = []

for year_dir in root_dirs:
    full_path = root_dir + year_dir
    print("Full_path: ", str(full_path))
    csvs = os.listdir(full_path)

    full_file_paths = list(map(lambda c: (os.path.join(full_path, c)), csvs))

    files = files + full_file_paths
    files = list(filter(lambda f: (".ProcData.csv" in f), files))

print("source files: ", str(files))

# combine all files in the list
combined_csv = pd.concat([pd.read_csv(f) for f in files])

removed_headers = combined_csv.values.tolist()[1:]

removed_headers_sorted = sorted(removed_headers, key=lambda row: datetime.strptime(row[0], "%m/%d/%Y %H:%M"))

# #sort 07/27/2020 20:00
# combined_csv = combined_csv
# combined_csv = sorted(combined_csv, key = lambda row: datetime.strptime(row[0], "%m/%d/%Y %H:%M"))
# export to csv
combined_csv = pd.DataFrame(removed_headers_sorted, index=None, columns=combined_csv.columns)
combined_csv.to_csv("combined_csv.csv", index=False)

data = []
#
# for file in files:
#     with open(file) as f:
#         reader = csv.reader(f)
#
#         #Skip the header of the csv
#         next(reader)
#         print(file)
#         print(list(reader)[:5])
#         data = data + list(reader)
#         #print(file + " \t" + str(reader.line_num))

print(len(data), " lines total")

print("Data Loaded")

print("Data restructuring")

print("Data restructured")

#
#
#
# fig, ax = plt.subplots()
# df_small_noise.plot(legend=False, ax=ax)
# plt.show()
