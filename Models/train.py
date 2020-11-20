import pandas as pd
import numpy as np
from tensorflow import keras
from matplotlib import pyplot as plt

percent_train = 0.95
units = 64
dropout = 0.20
optimizer = 'adam'
loss = 'mae'
epochs = 100
sequential_entries = 48

data_source = "combined_csv.csv"
df_data = pd.read_csv(
    data_source, parse_dates=True, index_col="timestamp"
)

print(df_data.head())

fig, ax = plt.subplots()
df_data.plot(legend=False, ax=ax)
# plt.show()

# Prep train and test data
train_size = int(len(df_data) * percent_train)
test_size = len(df_data) - train_size
train, test = df_data.iloc[0:train_size], df_data.iloc[train_size:len(df_data)]

print('Train shape:', train.shape)
print('Test shape: ', test.shape)


# helper function
def create_dataset(X, y, time_steps=1):
    Xs, ys = [], []
    for i in range(len(X) - time_steps):
        v = X.iloc[i:(i + time_steps)].values
        Xs.append(v)
        ys.append(y.iloc[i + time_steps])
    return np.array(Xs), np.array(ys)


# reshape to 3D [n_samples, n_steps, n_features]
 X_train, y_train = train[:sequential_days], train[:]#create_dataset(train, train, sequential_days)
X_test, y_test = create_dataset(test, test, sequential_days)
print('X_train shape:', X_train.shape)
print('X_test shape:', X_test.shape)

model = keras.Sequential()
model.add(keras.layers.LSTM(
    units=64,
    input_shape=(X_train.shape[1], X_train.shape[2])
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

# model = keras.Sequential()
# model.add(keras.layers.LSTM(units=units, input_shape=(X_train.shape[1], X_train.shape[2])))
# model.add(keras.layers.Dropout(rate=dropout))
# model.add(keras.layers.RepeatVector(n=X_train.shape[1]))
# model.add(keras.layers.LSTM(units=units, return_sequences=True))
# model.add(keras.layers.Dropout(rate=dropout))
# model.add(keras.layers.TimeDistributed(keras.layers.Dense(units=X_train.shape[2])))
#
# model.compile(loss=loss, optimizer=optimizer)
# history = model.fit(X_train, y_train, epochs=epochs, batch_size=32, validation_split=0.1, shuffle=False)

# history for loss
plt.figure(figsize=(10, 5))
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()
