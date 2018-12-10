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

  render() {
    return (
      <View>
        <View style={styles.viewStyle}>
          <View>
            <Text style={styles.textStyle}>{this.props.headerText} </Text>
          </View>
          <View>
            <Icon name="more" color="white" size={24} onPress={() => this.toggleModal()} />
          </View>
        </View>
        <Modal
          animationType={'fade'}
          transparent
          visible={this.state.drawerClosed}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <View style={styles.dialog}>
              {/* <TouchableOpacity onPress={() => this.toggleModal()}>
                  <Text style={styles.modalText}>Profile</Text>
                </TouchableOpacity>
                <View
                  style={{
                    borderBottomColor: 'white',
                    borderBottomWidth: 1
                  }}
                /> */}
              <TouchableOpacity
                onPress={() => {
                  this.toggleModal();
                  Actions.LoginComponent();
                }}
              >
                <Text style={styles.modalText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    fontWeight: 'bold',
    mariginTop: 20
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    padding: 10
  }
});
