import React, { Component, PropTypes } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const menuList = require('./MenuItem.js');

export default class Menu extends Component {
  handleMenuPressed(index) {
    console.log(index);
    switch (index) {
      case 1:
        console.log('Action Pressed');
        break;
      case 2:
        // Actions.LoginComponent();
        break;
      default:
        console.log('Default Action');
    }
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView>
          {menuList.MENU_LIST.map(item => (
            <TouchableOpacity key={item.index} onPress={() => this.handleMenuPressed(item.index)}>
              <Text style={styles.listMenu}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: 150,
    position: 'absolute',
    right: 35,
    top: 20,
    backgroundColor: '#512DA8',

    zIndex: 1
  },

  listMenu: {
    fontWeight: 'bold',
    padding: 5,
    color: 'white',
    fontSize: 18
  }
});
