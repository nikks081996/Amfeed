import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  Text,
  Alert,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import uuid from 'uuid';
import { ExpoConfigView } from '@expo/samples';

import { SecureStore, ImageManipulator, ImagePicker } from 'expo';
import { Avatar } from 'react-native-elements';

import HeaderComponentWithIcon from '../../../utility/HeaderComponentWithIcon';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    // console.log('constructor');
    this.state = {
      username: '',
      password: '',
      imageUrl: ''
    };
  }
  componentWillMount() {
    this.getCurrentUserName();
  }

  getCurrentUserName() {
    SecureStore.getItemAsync('userinfo').then(userdata => {
      const userinfo = JSON.parse(userdata);
      if (userinfo) {
        this.setState({
          username: userinfo.username,
          password: userinfo.password,
          imageUrl: userinfo.userProfileImageUrl
        });
      }
    });
    console.log('url', this.state.imageUrl);
  }

  pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: 'Images'
    });

    if (!result.cancelled) {
      //console.log(result.type);
      //this.setState({ imageUrl: result.uri });
      this.processImage(result.uri);
    }

    // }
  };
  processImage = async imageUri => {
    const processedImage = await ImageManipulator.manipulate(
      imageUri,
      [{ resize: { width: 400 } }],
      {
        format: 'png'
      }
    );
    this.setState({ imageUrl: processedImage.uri });
    console.log(processedImage);
    const uploadUrl = await this.uploadImageAsync(this.state.imageUrl, this.state.username);
    console.log(uploadUrl);

    //console.log(this.state.imageUrl);
  };

  async uploadImageAsync(uri, username) {
    const firebase = require('firebase');

    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
    console.log('uploadImageAsync');
    const snapshot = await ref.put(blob);
    snapshot.ref.getDownloadURL().then(url => {
      this.setState({ imageUrl: url });
      this.uploadUrlToDatabase(url, username);
      this.storeData(url);
      console.log(url);
    });
    return snapshot.downloadURL;
  }

  uploadUrlToDatabase(url, username) {
    const firebase = require('firebase');

    const imagesRef = firebase.database().ref('users/');
    imagesRef
      .orderByChild('username')
      .equalTo(username)
      .on('child_added', data => {
        console.log(`Equal to filter: ${data.key}`);
        const adaNameRef = firebase.database().ref(`users/${data.key}/`);
        adaNameRef.update({ userProfileImageUrl: url });
      });
  }

  storeData(url) {
    SecureStore.setItemAsync(
      'userinfo',
      JSON.stringify({
        // username: this.state.username,
        // password: this.state.password,
        // remember: false,
        userProfileImageUrl: url
      })
    ).catch(error => console.log('Could not save user info', error));
  }

  showAlert() {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to reset password?',
      [
        {
          text: 'Ok',
          onPress: () => this.resetPassword()
        },
        {
          text: 'Cancel'
          //onPress: () => this.resetPassword()
        }
      ],
      {
        cancelable: true
      }
    );
  }

  resetPassword() {
    const firebase = require('firebase');

    Keyboard.dismiss();
    this.setState({ loading: !this.state.loading });
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.username)
      .then(() => {
        Alert.alert(
          'Reset Password',
          'A link sent to registered email id.',
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

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    console.log(this.state.imageUrl);
    return (
      <View>
        <HeaderComponentWithIcon headerText="Profile" />
        <View>
          <ImageBackground
            source={require('../../../utility/effile_tower.jpg')}
            style={styles.backgroundImage}
          />
          <View
            style={{
              position: 'absolute',
              marginTop: Dimensions.get('window').height / 4,
              // marginLeft: Dimensions.get('window').width / 3,
              flexDirection: 'column',
              alignSelf: 'center',
              justifyContent: 'center'
            }}
          >
            <View
              style={{
                // width: 150,
                // height: 150,
                // borderRadius: 150 / 2,
                // backgroundColor: '#D7BEEA',
                // opacity: 1
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Avatar
                source={
                  this.state.imageUrl === '' || this.state.imageUrl === undefined
                    ? require('../../../utility/logo.png')
                    : { uri: this.state.imageUrl }
                }
                containerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                rounded
                showEditButton
                size="xlarge"
                onEditPress={() => this.pickImageFromGallery()}
              />
            </View>

            <Text style={styles.textStyle}>{this.state.username}</Text>
            <TouchableOpacity style={styles.forgotPasswordStyle} onPress={() => this.showAlert()}>
              <Text style={{ color: 'blue', fontSize: 18 }}>Reset password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  backgroundImage: {
    resizeMode: 'cover', // or 'stretch'
    width: '100%',
    height: '100%',
    opacity: 0.5
  },
  loginForm: {
    //position: 'absolute',
    justifyContent: 'center'
  },
  textStyle: {
    fontStyle: 'italic',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  forgotPasswordStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  }
});
