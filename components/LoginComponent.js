import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity
} from 'react-native';
import { Input, CheckBox, Icon, Button } from 'react-native-elements';
import { SecureStore, Permissions, ImagePicker, ImageManipulator, Notifications } from 'expo';
import { createBottomTabNavigator } from 'react-navigation';
import { Actions } from 'react-native-router-flux';
import { HeaderComponent } from './HeaderComponent';
import { Spinner } from './Spinner';

class LoginTab extends Component {
  static navigationOptions = {
    title: 'Login',
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon name="sign-in" type="font-awesome" size={24} iconStyle={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      remember: false,
      showModal: false,
      email: '',
      loading: false
    };
  }

  componentDidMount() {
    SecureStore.getItemAsync('userinfo').then(userdata => {
      const userinfo = JSON.parse(userdata);
      if (userinfo) {
        this.setState({ username: userinfo.username });
        this.setState({ password: userinfo.password });
        this.setState({ remember: true });
      }
    });
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal, email: '' });
  }

  handleLogin() {
    const firebase = require('firebase');

    this.setState({ loading: !this.state.loading });
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
    console.log('Success');

    // firebase
    //   .database()
    //   .ref('users')
    //   .on('value', snapshot => {
    //     console.log(snapshot.val());
    //   });

    // const user = firebase.auth().currentUser;
    // console.log(user.username);

    this.setState({
      username: '',
      password: '',
      loading: !this.state.loading
    });
    //sconsole.log(b);
  }

  checkEmail() {
    const firebase = require('firebase');

    const playersRef = firebase.database().ref('users');
    playersRef
      .orderByChild('username')
      .equalTo(this.state.email)
      .on(
        'child_added',
        data => {
          this.presentLocalNotification(data.val().password);
        },
        error => {
          console.log(`Error: ${error.code}`);
        }
      );
  }

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
    if (permission.status !== 'granted') {
      permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
      if (permission.status !== 'granted') {
        Alert.alert('Permission not granted to show notifications');
      }
    }
    return permission;
  }

  async presentLocalNotification(password) {
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
      title: 'Forgot Password for Amfeed',
      body: `your password is ${password}.`,
      ios: {
        sound: true
      },
      android: {
        sound: true,
        vibrate: true,
        color: '#512DA8'
      }
    });
  }

  onLoginFailed() {
    console.log('Failed');
    this.setState({ loading: !this.state.loading });
    Alert.alert(
      'Authentication Failed',
      'Login Failed',
      [
        {
          text: 'Ok'
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
        'userinfo',
        JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      ).catch(error => console.log('Could not save user info', error));
    } else {
      SecureStore.deleteItemAsync('userinfo').catch(error =>
        console.log('Could not delete user info', error)
      );
    }
    Actions.AppNavigator();
  }

  successOrNot() {
    //console.log("spinner Enter");
    if (this.state.loading) {
      console.log('loading');
      return <Spinner />;
    }
    console.log(this.state.loading);
    return <View />;

    //return <Spinner />;
  }

  render() {
    return (
      <View>
        <HeaderComponent headerText="Login" />
        <View style={styles.container}>
          <Input
            placeholder="Username"
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            containerStyle={styles.formInput}
          />
          <Input
            placeholder="Password"
            leftIcon={{ type: 'font-awesome', name: 'key' }}
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
              icon={<Icon name="sign-in" type="font-awesome" size={24} color="white" />}
              buttonStyle={{
                backgroundColor: '#512DA8'
              }}
            />
          </View>
          <TouchableOpacity style={styles.forgotPasswordStyle} onPress={() => this.toggleModal()}>
            <Text style={{ color: 'blue' }}>forgot password?</Text>
          </TouchableOpacity>
          <View style={styles.formButton}>
            <Button
              onPress={() => this.props.navigation.navigate('Register')}
              title="Register"
              clear
              icon={<Icon name="user-plus" type="font-awesome" size={24} color="blue" />}
              titleStyle={{
                color: 'blue'
              }}
            />
          </View>
          <View style={styles.loading}>{this.successOrNot()}</View>
        </View>
        <Modal
          animationType={'slide'}
          transparent
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <View style={styles.dialog}>
              <Input
                inputStyle={{ color: 'white' }}
                style={styles.modalText}
                placeholder="Enter Registered Email Id"
                onChangeText={text => this.setState({ email: text })}
                leftIcon={<Icon name="user-o" type="font-awesome" size={24} color="white" />}
              />

              <View
                style={{ marginTop: 20, flexDirection: 'column', marginRight: 10, marginLeft: 10 }}
              >
                <Button
                  style={styles.modalText}
                  onPress={() => {
                    this.checkEmail();
                    //  this.postNewComment(dishId);
                  }}
                  buttonStyle={{
                    backgroundColor: '#ffffff'
                  }}
                  titleStyle={{
                    color: 'blue'
                  }}
                  title="Send Password"
                />
              </View>

              <View
                style={{ marginTop: 30, flexDirection: 'column', marginRight: 10, marginLeft: 10 }}
              >
                <Button
                  style={styles.modalText}
                  onPress={() => {
                    this.toggleModal();
                    // this.resetCommentDetails();
                  }}
                  buttonStyle={{
                    backgroundColor: '#ffffff'
                  }}
                  titleStyle={{
                    color: 'blue'
                  }}
                  title="Close"
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

class RegisterTab extends Component {
  static navigationOptions = {
    title: 'Register',
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon name="user-plus" type="font-awesome" size={24} iconStyle={{ color: tintColor }} />
    )
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      remember: false,
      loading: false
    };
  }

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
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
        format: 'png'
      }
    );
    console.log(processedImage);
    // this.setState({ imageUrl: processedImage.uri });
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
  changeLoadingState = () => {
    this.setState({ loading: true });
  };
  handleRegister() {
    const firebase = require('firebase');

    const { username, password, confirmPassword } = this.state;
    Keyboard.dismiss();
    if (confirmPassword !== password) {
      Alert.alert('Password didnt match');
    } else {
      this.setState({ loading: !this.state.loading });
      // this.changeLoadingState.bind(this);
      // this.successOrNot();
      console.log('firebase enter');
      firebase
        .auth()
        .createUserWithEmailAndPassword(username, password)
        .then(() => {
          firebase
            .database()
            .ref('users')
            .push({
              username,
              password
            })
            .then(() => {
              console.log('success');
              this.setState({ loading: !this.state.loading });
              //   this.changeLoadingState.bind(this);
              //  this.successOrNot();
              Actions.AppNavigator();
            });
        })
        .catch(error => {
          this.setState({ loading: !this.state.loading });
          // this.changeLoadingState.bind(this);
          //  this.successOrNot();
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/weak-password') {
            Alert.alert('The password is too weak.');
          } else if (errorCode === 'auth/email-already-in-use') {
            Alert.alert('The email is already taken.');
          } else if (errorCode === 'auth/weak-password') {
            Alert.alert('Password is weak');
          } else if (errorCode === 'auth/invalid-email') {
            Alert.alert(errorMessage);
          } else {
            Alert.alert(errorMessage);
          }
          console.log(errorMessage);
          console.log(errorCode);
        });
    }
    // this.setState({ loading: true });
  }

  signUpSuccess() {
    console.log('success');
    //this.setState({ loading: false });
    //  this.successOrNot();
    Actions.AppNavigator();
  }
  successOrNot() {
    //console.log("spinner Enter");
    if (this.state.loading) {
      console.log('loading');
      return <Spinner />;
    }
    console.log(this.state.loading);
    return <View />;

    //return <Spinner />;
  }

  onLoginSuccess() {
    this.storeData();
    console.log('Success');
    this.setState({
      username: '',
      password: ''
    });
  }

  onLoginFailed() {
    console.log('Failed');
    Alert.alert(
      'Authentication Failed',
      'Login Failed',
      [
        {
          text: 'Ok'
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
        'userinfo',
        JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      ).catch(error => console.log('Could not save user info', error));
    }
  }

  cancelRegister() {
    this.setState({ username: '', password: '', confirmPassword: '' });
  }

  render() {
    return (
      <View>
        <HeaderComponent headerText="Register" />
        <ScrollView>
          <View style={styles.container}>
            <Input
              placeholder="Username"
              leftIcon={{ type: 'font-awesome', name: 'user-o' }}
              onChangeText={username => this.setState({ username })}
              value={this.state.username}
              containerStyle={styles.formInput}
            />
            <Input
              placeholder="Password"
              leftIcon={{ type: 'font-awesome', name: 'key' }}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              containerStyle={styles.formInput}
            />
            <Input
              placeholder="Confirm Password"
              leftIcon={{ type: 'font-awesome', name: 'key' }}
              onChangeText={confirmPassword => this.setState({ confirmPassword })}
              value={this.state.confirmPassword}
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
                icon={<Icon name="user-plus" type="font-awesome" size={24} color="white" />}
                buttonStyle={{
                  backgroundColor: '#512DA8'
                }}
              />
            </View>
            <View style={styles.formCancelButton}>
              <Button
                onPress={() => this.cancelRegister()}
                title="Cancel"
                buttonStyle={{
                  backgroundColor: '#512DA8'
                }}
              />
            </View>
            <View style={styles.loading}>{this.successOrNot()}</View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 20
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    marginTop: 60,
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 20
  },
  forgotPasswordStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  formCancelButton: {
    marginTop: 0,
    marginLeft: 60,
    marginRight: 60
  },
  modal: {
    justifyContent: 'center',
    marginTop: 200,
    marginLeft: 20,
    marginRight: 20
  },
  dialog: {
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20
  },
  modalText: {
    fontSize: 18,
    margin: 10,
    textColor: 'white'
  },
  loading: {
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute'
  }
});

const Login = createBottomTabNavigator(
  {
    Login: LoginTab,
    Register: RegisterTab
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#9575CD',
      inactiveBackgroundColor: '#D1C4E9',
      activeTintColor: '#ffffff',
      inactiveTintColor: 'gray'
    }
  }
);

export default Login;
