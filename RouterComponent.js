import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import LoginComponent from './src/components/LoginComponent';
import AppNavigator from './src/components/navigation/AppNavigator';
import HomeScreen from './src/components/screens/home/HomeScreen';
import LikeByComponent from './src/components/screens/home/LikeByComponent';

const RouterComponent = () => (
  <MenuProvider>
    <Router>
      <Scene key="main" hideTabBar>
        <Scene
          key="LoginComponent"
          component={LoginComponent}
          title="LoginComponent"
          initial
          hideNavBar
        />
        <Scene key="AppNavigator" component={AppNavigator} hideNavBar />
      </Scene>
      <Scene key="HomeScreen" component={HomeScreen}>
        <Scene key="LikeByComponent" component={LikeByComponent} hideNavBar />
      </Scene>
    </Router>
  </MenuProvider>
);

export default RouterComponent;
