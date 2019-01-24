import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-elements';

const styles = StyleSheet.create({
  loadingView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 100
  },
  loadingText: {
    color: '#512DA8',
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
      <Card image={{ uri: url }} imageStyle={{ width: '100%', height: 250 }}>
        <Text style={{ margin: 10 }}>{caption}</Text>
      </Card>
    </TouchableOpacity>
  );
};
