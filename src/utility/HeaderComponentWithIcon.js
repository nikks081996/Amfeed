import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { Ionicons } from '@expo/vector-icons';
import Menu from './Menu';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerClosed: false
    };
  }

  toggleModal() {
    this.setState({ drawerClosed: !this.state.drawerClosed });
  }

  showModal() {
    if (this.state.drawerClosed) {
      return <Menu />;
    }
    return <View />;
  }

  showIcon() {
    if (this.props.headerText === 'Login' || this.props.headerText === 'Register') {
      return <View />;
    }
    return (
      <View>
        <Icon name="more" color="white" size={24} onPress={() => this.toggleModal()} />
      </View>
    );
  }
  render() {
    return (
      <View>
        <View style={styles.viewStyle}>
          <View>
            <Text style={styles.textStyle}>{this.props.headerText} </Text>
          </View>
          {this.showIcon()}
        </View>
        {this.showModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#33cc33',
    flex: 1,
    paddingTop: 10,
    alignItems: 'center'
    //padding: 10
  },
  viewStyle: {
    backgroundColor: '#512DA8',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 15,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    marginTop: 0
  },
  textStyle: {
    fontSize: 20,
    color: '#ffffff'
  },
  modal: {
    width: 150,
    position: 'absolute',
    right: 35,
    top: 20,
    backgroundColor: '#512DA8'
  },
  outsideModel: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  dialog: {
    fontWeight: 'bold'
    //mariginTop: 20
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    padding: 10
  }
});
