import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  ToastAndroid
} from 'react-native';
import { connect } from 'react-redux';
import RNFetchBlob from 'react-native-fetch-blob';
import { Input, CheckBox, Button, Icon, Tile } from 'react-native-elements';
import { SecureStore, Camera, Permissions, Asset, ImagePicker, ImageManipulator } from 'expo';

import { fetchUser, addImages } from '../src/redux/Action/ActionCreators';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      remember: false
    };
  }

  componentWillMount() {
    // this.props.addImages("nikita");
    this.props.fetchUser();
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
    this.getUri(processedImage.uri);
    this.props.addImages(processedImage.uri);
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

  getUri(path) {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;
    //const { uid } = this.state.user
    const uid = '12345';
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo'
    })
      .then(image => {
        const imagePath = image.path;

        let uploadBlob = null;
        const firebase = require('firebase');

        const imageRef = firebase
          .storage()
          .ref(uid)
          .child('dp.jpg');
        const mime = 'image/jpg';
        fs.readFile(imagePath, 'base64')
          .then(data =>
            //console.log(data);
            Blob.build(data, { type: `${mime};BASE64` })
          )
          .then(blob => {
            uploadBlob = blob;
            return imageRef.put(blob, { contentType: mime });
          })
          .then(() => {
            uploadBlob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            console.log(url);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleRegister() {}

  RenderUser(users) {
    if (users != null) {
      console.log('data');
      console.log(users);

      return (
        <FlatList
          data={users}
          renderItem={({ item }) => this.renderUserCard(item)}
          keyExtractor={item => item.toString()}
        />
      );
    }
  }

  renderUserCard(item) {
    console.log(item);
    return (
      <View>
        <Tile
          titleStyle={{ alignItems: 'center' }}
          //key={item}
          containerStyle={{ flex: 1, marginRight: 10 }}
          imageSrc={{ uri: item }}
          title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores dolore exercitationem"
          contentContainerStyle={{ height: 70 }}
        />
        {/* <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text>Caption</Text>
          <Text>Caption</Text>
        </View> */}
      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: this.state.imageUrl }} style={styles.image} />
            <Button title="Camera" onPress={this.getImageFromCamera} />
            <Button title="Gallery" onPress={this.pickImageFromGallery} />
          </View>

          {this.RenderUser(this.props.user)}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 20
  },
  imageContainer: {
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
    margin: 60
  },
  tiles: {
    justifyContent: 'center'
  }
});

const mapStateToProps = state => {
  const { isLoading, errMess, user } = state.user;
  // console.log(state.user.user);
  return { isLoading, errMess, user };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchUser, addImages }
)(HomeScreen);
