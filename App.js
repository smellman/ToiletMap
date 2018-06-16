import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MapView } from 'expo';
// 1: turf で使う関数をインポート
import {
  point
} from '@turf/helpers'
import destination from '@turf/destination'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      elements: [], // 2: APIで取得した要素
      // 3: bboxの指定
      south: null,
      west: null,
      north: null,
      east: null,
    }
  }

  // 4: 地図の画面が変更されるたびにbboxを計算
  onRegionChangeComplete = (region) => {
    const center = point([region.longitude, region.latitude])
    // 5: 111キロメートルから中心点から縦幅、横幅を計算
    const verticalMeter = 111 * region.latitudeDelta / 2
    const horizontalMeter = 111 * region.longitudeDelta / 2
    // 6: 実際の距離を計算
    const options = {units: 'kilometers'}
    const south = destination(center, verticalMeter, 180, options)
    const west = destination(center, horizontalMeter, -90, options)
    const north = destination(center, verticalMeter, 0, options)
    const east = destination(center, horizontalMeter, 90, options)
    // 7: 計算結果(GeoJSON)からbboxを保存する
    this.setState({
      south: south.geometry.coordinates[1],
      west: west.geometry.coordinates[0],
      north: north.geometry.coordinates[1],
      east: east.geometry.coordinates[0],
    })
  }

  // 8: fetchToilet内でawaitを使うのでasyncに
  fetchToilet = async () => {
    const south = this.state.south
    const west = this.state.west
    const north = this.state.north
    const east = this.state.east
    // 9: テンプレートリテラルを使ってbboxを展開
    const body = `
    [out:json];
    (
      node
        [amenity=toilets]
        (${south},${west},${north},${east});
      node
        ["toilets:wheelchair"=yes]
        (${south},${west},${north},${east});
    );
    out;
    `
    // 10: fetch関数に渡すoptionを指定
    const options = {
      method: 'POST',
      body: body
    }
    // 11: fetch関数でOverpass APIのエントリポイントにアクセスし、取得したJSONを保存
    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', options)
      const json = await response.json()
      this.setState({elements: json.elements})
    } catch (e) {
      console.log(e)
    }
  }
  render() {
    return (
      <View style={styles.container}>
        { /* 12: onRegionChangeCompleteを関連付け */ }
        <MapView
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={styles.mapview}
          initialRegion={{
            latitude: 35.681262,
            longitude: 139.766403,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00521,
          }}>
          { /* 13: マーカーをstateのelementsから配置するようにする */}
          {
            this.state.elements.map((element) => {
              let title = "トイレ"
              if (element.tags["name"] !== undefined) {
                title = element.tags["name"]
              }
              return (<MapView.Marker
                coordinate={{
                  latitude: element.lat,
                  longitude: element.lon,
                }}
                title={title}
                key={"id_" + element.id}
              />)
            })
          }
        </MapView>
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
    justifyContent: 'flex-end',
  },
  mapview: {
    ...StyleSheet.absoluteFillObject,
  },
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
