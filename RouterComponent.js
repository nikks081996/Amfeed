import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import LoginComponent from './src/components/LoginComponent';
import AppNavigator from './src/components/navigation/AppNavigator';

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
    </Router>
  </MenuProvider>
);

export default RouterComponent;
