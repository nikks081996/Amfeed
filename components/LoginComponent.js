import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Keyboard
} from "react-native";
import { Input, CheckBox, Button, Icon } from "react-native-elements";
import {
  SecureStore,
  Camera,
  Permissions,
  ImagePicker,
  Asset,
  ImageManipulator
} from "expo";
import { createBottomTabNavigator } from "react-navigation";
import { Actions } from "react-native-router-flux";
import { HeaderComponent } from "./HeaderComponent";

class LoginTab extends Component {
  static navigationOptions = {
    header: "Login"
  };

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      remember: false
    };
  }

  componentDidMount() {
    SecureStore.getItemAsync("userinfo").then(userdata => {
      const userinfo = JSON.parse(userdata);
      if (userinfo) {
        this.setState({ username: userinfo.username });
        this.setState({ password: userinfo.password });
        this.setState({ remember: true });
      }
    });
  }

  handleLogin() {
    const firebase = require("firebase");
    const { username, password } = this.state;
    Keyboard.dismiss();
    //  this.renderButton();
    console.log(username, password);
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(this.onLoginFailed.bind(this));
  }

  onLoginSuccess() {
    this.storeData();
    console.log("Success");
    this.setState({
      username: "",
      password: ""
    });
  }

  onLoginFailed() {
    console.log("Failed");
    Alert.alert(
      "Authentication Failed",
      "Login Failed",
      [
        {
          text: "Ok"
        }
      ],
      {
        cancelable: true
      }
    );
    //  this.setState({ error: "Authentication Failed", loading: false });
  }

  storeData() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember) {
      SecureStore.setItemAsync(
        "userinfo",
        JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      ).catch(error => console.log("Could not save user info", error));
    } else {
      SecureStore.deleteItemAsync("userinfo").catch(error =>
        console.log("Could not delete user info", error)
      );
    }
    Actions.AppNavigator();
  }

  render() {
    return (
      <View>
        <HeaderComponent headerText="Login" />
        <View style={styles.container}>
          <Input
            placeholder="Username"
            leftIcon={{ type: "font-awesome", name: "user-o" }}
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder="Password"
            leftIcon={{ type: "font-awesome", name: "key" }}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            containerStyle={styles.formInput}
          />
          <CheckBox
            title="Remember Me"
            center
            checked={this.state.remember}
            onPress={() => this.setState({ remember: !this.state.remember })}
            containerStyle={styles.formCheckbox}
          />
          <View style={styles.formButton}>
            <Button
              onPress={() => this.handleLogin()}
              title="Login"
              icon={
                <Icon
                  name="sign-in"
                  type="font-awesome"
                  size={24}
                  color="white"
                />
              }
              buttonStyle={{
                backgroundColor: "#512DA8"
              }}
            />
          </View>
          <View style={styles.formButton}>
            <Button
              onPress={() => this.props.navigation.navigate("Register")}
              title="Register"
              clear
              icon={
                <Icon
                  name="user-plus"
                  type="font-awesome"
                  size={24}
                  color="blue"
                />
              }
              titleStyle={{
                color: "blue"
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

class RegisterTab extends Component {
  static navigationOptions = {
    title: "Register",
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon
        name="user-plus"
        type="font-awesome"
        size={24}
        iconStyle={{ color: tintColor }}
      />
    )
  };

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      email: "",
      remember: false,
      imageUrl: ""
    };
  }

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (
      cameraPermission.status === "granted" &&
      cameraRollPermission.status === "granted"
    ) {
      const capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      if (!capturedImage.cancelled) {
        console.log(capturedImage);
        this.processImage(capturedImage.uri);
      }
    }
  };

  processImage = async imageUri => {
    const processedImage = await ImageManipulator.manipulate(
      imageUri,
      [{ resize: { width: 400 } }],
      {
        format: "png"
      }
    );
    console.log(processedImage);
    this.setState({ imageUrl: processedImage.uri });
  };

  pickImageFromGallery = async () => {
    // const { Permissions } = Expo;
    // const { status, expires, permissions } = await Permissions.askAsync(
    //   Permissions.READ_EXTERNAL_STORAGE,
    //   Permissions.WRITE_EXTERNAL_STORAGE
    // );
    // if (status === 'granted') {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    console.log(result);

    if (!result.cancelled) {
      this.processImage(result.uri);
    }
    // }
  };
  handleRegister() {
    const firebase = require("firebase");
    const { username, password, firstname, lastname, email } = this.state;
    Keyboard.dismiss();
    //  this.renderButton();
    firebase
      .auth()
      .createUserWithEmailAndPassword(username, password)
      .then(function(user) {
        var ref = firebase
          .database()
          .ref("users")
          .push({
            username,
            password,
            firstname,
            lastname,
            email
          })
          .then(() => console.log("successss"));
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          alert("The password is too weak.");
        } else if (errorCode == "auth/email-already-in-use") {
          alert("The email is already taken.");
        } else if (errorCode == "auth/weak-password") {
          alert("Password is weak");
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

  onLoginSuccess() {
    this.storeData();
    console.log("Success");
    this.setState({
      username: "",
      password: ""
    });
  }

  onLoginFailed() {
    console.log("Failed");
    Alert.alert(
      "Authentication Failed",
      "Login Failed",
      [
        {
          text: "Ok"
        }
      ],
      {
        cancelable: true
      }
    );
    //  this.setState({ error: "Authentication Failed", loading: false });
  }

  storeData() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember) {
      SecureStore.setItemAsync(
        "userinfo",
        JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      ).catch(error => console.log("Could not save user info", error));
    }
  }

  render() {
    return (
      <View>
        <HeaderComponent headerText="Register" />
        <ScrollView>
          <View style={styles.container}>
            <Input
              placeholder="Username"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              onChangeText={username => this.setState({ username })}
              value={this.state.username}
              containerStyle={styles.formInput}
            />
            <Input
              placeholder="Password"
              leftIcon={{ type: "font-awesome", name: "key" }}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              containerStyle={styles.formInput}
            />
            <Input
              placeholder="First Name"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              onChangeText={firstname => this.setState({ firstname })}
              value={this.state.firstname}
              containerStyle={styles.formInput}
            />
            <Input
              placeholder="Last Name"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              onChangeText={lastname => this.setState({ lastname })}
              value={this.state.lastname}
              containerStyle={styles.formInput}
            />
            <Input
              placeholder="Email"
              leftIcon={{ type: "font-awesome", name: "envelope-o" }}
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              containerStyle={styles.formInput}
            />
            <CheckBox
              title="Remember Me"
              center
              checked={this.state.remember}
              onPress={() => this.setState({ remember: !this.state.remember })}
              containerStyle={styles.formCheckbox}
            />
            <View style={styles.formButton}>
              <Button
                onPress={() => this.handleRegister()}
                title="Register"
                icon={
                  <Icon
                    name="user-plus"
                    type="font-awesome"
                    size={24}
                    color="white"
                  />
                }
                buttonStyle={{
                  backgroundColor: "#512DA8"
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    margin: 20
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20
  },
  image: {
    margin: 10,
    width: 80,
    height: 60
  },
  formInput: {
    margin: 20
  },
  formCheckbox: {
    margin: 20,
    backgroundColor: null
  },
  formButton: {
    margin: 60
  }
});

const Login = createBottomTabNavigator(
  {
    Login: LoginTab,
    Register: RegisterTab
  },
  {
    tabBarOptions: {
      activeBackgroundColor: "#9575CD",
      inactiveBackgroundColor: "#D1C4E9",
      activeTintColor: "#ffffff",
      inactiveTintColor: "gray"
    }
  }
);

export default Login;
