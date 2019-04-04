import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Video } from 'expo';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { Card } from 'react-native-elements';

export default class ShowVideo extends React.Component {
  // state = {
  //   mute: false,
  //   fullScreen: false,
  //   shouldPlay: true
  // };
  constructor(props) {
    super(props);
    this.state = {
      mute: true,
      fullScreen: false,
      shouldPlay: false
    };
  }

  handlePlayAndPause = () => {
    this.setState(prevState => ({
      shouldPlay: !prevState.shouldPlay
    }));
  };

  handleVolume = () => {
    this.setState(prevState => ({
      mute: !prevState.mute
    }));
  };

  render() {
    // console.log('videooooo', this.props);
    const { width } = Dimensions.get('window');

    return (
      <TouchableOpacity onLongPress={this.props.ondata}>
        <View style={{ width: Dimensions.get('window').width, backgroundColor: 'white' }}>
          <View>
            <Video
              source={{ uri: this.props.url }}
              shouldPlay={this.state.shouldPlay}
              resizeMode="contain"
              style={{
                height: Dimensions.get('window').width
              }}
              isMuted={this.state.mute}
              isLooping
            />
            <View style={styles.controlBar}>
              <MaterialIcons
                name={this.state.mute ? 'volume-mute' : 'volume-up'}
                size={25}
                color="white"
                onPress={this.handleVolume}
              />
              <MaterialIcons
                name={this.state.shouldPlay ? 'pause' : 'play-arrow'}
                size={25}
                color="white"
                onPress={this.handlePlayAndPause}
              />
            </View>
          </View>
          <Text
            style={{
              textAlign: 'center',
              paddingTop: 10,
              fontFamily: 'dancing-script',
              fontSize: 20
            }}
          >
            {this.props.caption}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 90
  },
  controlBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});
