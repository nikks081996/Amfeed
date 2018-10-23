import React from "react";
import { Scene, Router } from "react-native-router-flux";
import LoginComponent from "./components/LoginComponent";
import AppNavigator from "./navigation/AppNavigator";

const RouterComponent = () => (
  <Router>
    <Scene key="root">
      <Scene key="main" hideTabBar>
        <Scene
          key="LoginComponent"
          component={LoginComponent}
          title="LoginComponent"
          initial
          hideNavBar
        />
        <Scene
          key="AppNavigator"
          component={AppNavigator}
          title="AppNavigator"
          hideNavBar
        />
      </Scene>
    </Scene>
  </Router>
);

export default RouterComponent;
