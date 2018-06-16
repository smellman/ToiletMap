import React from 'react';
// 1: TouchableOpacityを追加
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MapView } from 'expo';

export default class App extends React.Component {
  // 2: fetchToilet関数を追加、まだ何もしない
  fetchToilet = () => {
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapview}
          initialRegion={{
            latitude: 35.681262,
            longitude: 139.766403,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00521,
          }}>
          <MapView.Marker
            coordinate={{
              latitude: 35.681262,
              longitude: 139.766403
            }}
            title="東京駅"
          />
        </MapView>
        { /* 3: ボタンのコンテナとボタンを追加 */ }
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.fetchToilet()}
            style={styles.button}
          >
            <Text style={styles.buttonItem}>トイレ取得</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end', // 4: 画面下から並ぶように指定
  },
  mapview: {
    ...StyleSheet.absoluteFillObject,
  },
  // 5: ボタンを配置するためのコンテナなどのスタイル
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  button: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonItem: {
    textAlign: 'center'
  },
});
