import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler
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
      loading: false,
      showUsername: '',
      showPassword: '',
      emailSentLoading: false
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    SecureStore.getItemAsync('userinfo').then(userdata => {
      const userinfo = JSON.parse(userdata);
      if (userinfo) {
        this.setState({ username: userinfo.username });
        this.setState({ password: userinfo.password });
        this.setState({ remember: userinfo.remember });
      }

      setTimeout(() => {
        if (this.state.remember) {
          this.setState({ showUsername: this.state.username });
          this.setState({ showPassword: this.state.password });
        }
      }, 2000);
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal, email: '' });
  }

  handleLogin() {
    const firebase = require('firebase');

    this.setState({ loading: !this.state.loading });
    const { showUsername, showPassword } = this.state;
    Keyboard.dismiss();

    firebase
      .auth()
      .signInWithEmailAndPassword(showUsername, showPassword)
      .then(this.onLoginSuccess.bind(this))
      .catch(this.onLoginFailed.bind(this));
  }

  onLoginSuccess() {
    this.storeData();

    this.setState({
      loading: !this.state.loading
    });
    //sconsole.log(b);
  }

  checkEmail() {
    // const firebase = require('firebase');
    // const playersRef = firebase.database().ref('users');
    // playersRef
    //   .orderByChild('username')
    //   .equalTo(this.state.email)
    //   .on(
    //     'child_added',
    //     data => {
    //       this.presentLocalNotification(data.val().password);
    //     },
    //     error => {
    //     }
    //   );
    // this.resetPassword();
  }

  resetPassword() {
    const firebase = require('firebase');

    this.setState({ loading: !this.state.loading });
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        Alert.alert(
          'Successful',
          'Email sent!',
          [
            {
              text: 'Ok'
            }
          ],
          {
            cancelable: true
          }
        );
      })
      .catch(() => {
        Alert.alert(
          'Failed',
          'Email not found',
          [
            {
              text: 'Ok'
            }
          ],
          {
            cancelable: true
          }
        );
      })
      .finally(() => this.setState({ loading: !this.state.loading }));
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
    SecureStore.deleteItemAsync('userinfo')
      .then(hello => console.log('jjj'))
      .catch(error => console.log('Could not delete user info', error));
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
  }
  handleBackButton = () => {
    //  const currentRouteName = this.context.router.getCurrentPathname();
    BackHandler.exitApp();
  };

  storeData() {
    SecureStore.setItemAsync(
      'userinfo',
      JSON.stringify({
        username: this.state.showUsername,
        password: this.state.showPassword,
        remember: this.state.remember
      })
    ).catch(error => console.log('Could not save user info', error));
    if (!this.state.remember) {
      this.setState({ showUsername: '', showPassword: '' });
    }
    const userName = this.state.username;
    Actions.AppNavigator();
  }

  successOrNot() {
    if (this.state.loading) {
      return <Spinner />;
    }
    return <View />;
  }

  maybeRenderUploadingOverlay = () => {
    if (this.state.loading) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  render() {
    return (
      <View>
        <HeaderComponent headerText="Login" />
        <ScrollView>
          <View style={styles.container}>
            <Input
              placeholder="Username"
              leftIcon={{ type: 'font-awesome', name: 'user-o' }}
              onChangeText={username => this.setState({ showUsername: username })}
              value={this.state.showUsername}
              containerStyle={styles.formInput}
            />
            <Input
              placeholder="Password"
              leftIcon={{ type: 'font-awesome', name: 'key' }}
              onChangeText={password => this.setState({ showPassword: password })}
              value={this.state.showPassword}
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
        </ScrollView>
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
              {this.maybeRenderUploadingOverlay()}

              <View
                style={{ marginTop: 20, flexDirection: 'column', marginRight: 10, marginLeft: 10 }}
              >
                <Button
                  style={styles.modalText}
                  onPress={() => {
                    this.resetPassword();
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
      loading: false
    };
  }

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
              this.storeData();
              // const userName = this.state.username;
              // Actions.AppNavigator({ userName });
            });
        })
        .catch(error => {
          this.setState({ loading: !this.state.loading });

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
  }

  storeData() {
    SecureStore.setItemAsync(
      'userinfo',
      JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        remember: false
      })
    ).catch(error => console.log('Could not save user info', error));

    const userName = this.state.username;
    Actions.AppNavigator();
  }

  successOrNot() {
    if (this.state.loading) {
      return <Spinner />;
    }
    return <View />;
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
    // fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20
  },
  modalText: {
    fontSize: 18,
    margin: 10,
    color: 'white'
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
