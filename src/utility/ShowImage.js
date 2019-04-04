import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';

const styles = StyleSheet.create({
  loadingView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 100
  },
  loadingText: {
    color: '#00BCD4',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

// Loading component to show loading indicator
export const ShowImage = props => {
  const { ondata, url, caption } = props;
  return (
    <TouchableOpacity onLongPress={ondata}>
      {/*  <Image style={{ width: '100%', height: 250 }} source={{ uri: url }} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: 20
          }}
        >
          {caption}
        </Text>
      </View> */}
      {/* <View
        image={{ uri: url }}
        imageStyle={{
          padding: 2,
          height: Dimensions.get('window').width - 90,
          width: Dimensions.get('window').width - 90
        }}
        containerStyle={{ width: Dimensions.get('window').width - 90 }}
      > */}
      <View
        style={{
          backgroundColor: 'white'
        }}
      >
        <Image
          source={{ uri: url }}
          style={{
            height: Dimensions.get('window').width,
            width: Dimensions.get('window').width,

            resizeMode: 'contain'
          }}
        />
        <Text
          style={{ margin: 20, textAlign: 'center', fontFamily: 'dancing-script', fontSize: 20 }}
        >
          {caption}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
