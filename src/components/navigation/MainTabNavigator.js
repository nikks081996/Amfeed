import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../../utility/TabBarIcon';
import HomeScreen from '../screens/home/HomeScreen';
import LikeByComponent from '../screens/home/LikeByComponent';
import UserScreen from '../screens/user/UserScreen';
import SettingsScreen from '../screens/setting/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  LikeByComponent
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-home${focused ? '' : '-outline'}` : 'md-home'}
    />
  )
};

const UserStack = createStackNavigator({
  User: UserScreen
});

UserStack.navigationOptions = {
  tabBarLabel: 'Upload',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? `ios-cloud-upload${focused ? '' : '-outline'}` : 'md-cloud-upload'
      }
    />
  )
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-contact${focused ? '' : '-outline'}` : 'md-contact'}
    />
  )
};

export default createBottomTabNavigator({
  HomeStack,
  UserStack,
  SettingsStack
});
