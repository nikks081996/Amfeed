import React from 'react';
import { View } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import HeaderComponentWithIcon from '../components/HeaderComponentWithIcon';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View>
        <HeaderComponentWithIcon headerText="Settings" />
        <ExpoConfigView />
      </View>
    );
  }
}
