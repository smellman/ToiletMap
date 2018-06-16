import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// 1: MapViewをインポート
import { MapView } from 'expo';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        { /* 2: MapViewを配置 */ }
        <MapView
          style={styles.mapview}
          initialRegion={{
            latitude: 35.681262,
            longitude: 139.766403,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00521,
          }}>
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 3: MapViewに対応したスタイル
  mapview: {
    ...StyleSheet.absoluteFillObject,
  },
});
