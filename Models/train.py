import pandas as pd
import numpy as np
from tensorflow import keras
from matplotlib import pyplot as plt
from sklearn.preprocessing import MinMaxScaler, QuantileTransformer

# Cols, not stored in file because its easier for date parsing. timestamp,Ttl Volume,Avg Volume,Ttl Through,
# Ttl Left Turn,Ttl Right Turn,Ttl Wrong Way,Overall Avg Speed, Zone 2, Zone 3, Zone 4, Zone 5, Zone 2.1, Zone 3.1,
# Zone 4.1, Zone 5.1,Class 1: 0-22ft,Class 2: 22-36ft,Class 3: 36-Up, , .1, 04 Eb Through #1, 04 Eb Through #3,
# 07 Eb Left Turn #1, 07 Eb Left Turn #2, 04 Eb Through #1.1, 04 Eb Through #3.1, 07 Eb Left Turn #1.1, 07 Eb Left
# Turn #2.1

# establish hyper parameters
percent_train = 0.95
units = 64
dropout = 0.20
optimizer = 'adam'
loss = 'mae'
epochs = 100
sequential_entries = 96  # 48 hours worth of memory

# Read the CSV source
data_source = "combined_csv.csv"
df_data = pd.read_csv(
    data_source, parse_dates=True, index_col=0, header=None
)

# print(df_data.head())

# Display data on chart
fig, ax = plt.subplots()
df_data.plot(legend=False, ax=ax)
plt.show()

# Normalize data
scaler = MinMaxScaler()
scaler.fit(df_data[[1, df_data.shape[1]]])
df_data[[1, df_data.shape[1]]] = scaler.transform(df_data[[1, df_data.shape[1]]])

# Prep train and test data
train_size = int(df_data.shape[0] * percent_train)
test_size = len(df_data) - train_size
train, test = df_data.iloc[0:train_size], df_data.iloc[train_size:len(df_data)]

print('Train shape:', train.shape)
print('Test shape: ', test.shape)


# helper function to create the dataset for out model, straight from tf website
def create_dataset(X, y, time_steps=1):
    a, b = [], []
    for i in range(len(X) - time_steps):
        v = X.iloc[i:(i + time_steps)].values
        a.append(v)
        b.append(y.iloc[i + time_steps])
    return np.array(a), np.array(b)


# We’ll create sequences with 96 rows of historical data, 48 hours
# reshape to 3D [n_samples, n_steps, n_features]
trainable_data_cols = df_data.columns[1:]
X_train, y_train = create_dataset(train[trainable_data_cols], train[1], sequential_entries)
X_test, y_test = create_dataset(test[trainable_data_cols], test[1], sequential_entries)
print('X_train shape:', X_train.shape)
print('X_test shape:', X_test.shape)

# Random model for now just to try to get things working
model = keras.Sequential()
model.add(keras.layers.LSTM(
    units=64, input_shape=(X_train.shape[1], X_train.shape[2])
))
model.add(keras.layers.Dropout(rate=0.2))
model.add(keras.layers.RepeatVector(n=X_train.shape[1]))
model.add(keras.layers.LSTM(units=64, return_sequences=True))
model.add(keras.layers.Dropout(rate=0.2))
model.add(
    keras.layers.TimeDistributed(
        keras.layers.Dense(units=X_train.shape[2])
    )
)
model.compile(loss='mae', optimizer='adam')

history = model.fit(
    X_train, y_train,
    epochs=10,
    batch_size=32,
    validation_split=0.1,
    shuffle=False
)

# history for loss
plt.figure(figsize=(10, 5))
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()
