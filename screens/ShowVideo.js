import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Video } from 'expo';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

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
    console.log('videooooo', this.props);
    const { width } = Dimensions.get('window');

    return (
      <TouchableOpacity onLongPress={this.props.ondata}>
        <View style={styles.container}>
          <View>
            <Video
              source={{ uri: this.props.url }}
              shouldPlay={this.state.shouldPlay}
              resizeMode="cover"
              style={{ width, height: 250 }}
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
          <Text style={{ textAlign: 'center', paddingTop: 5 }}> {this.props.caption} </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: '100%'
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
