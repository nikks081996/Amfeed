import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { Button, Tile } from 'react-native-elements';
import { SecureStore, Permissions, ImagePicker } from 'expo';

import {
  fetchCurrentUserLoadedImages,
  noCurrentUserDataFound,
  currentUserLoading
} from '../src/redux/Action/ActionCreators';

let myData = [];
let i = 0;

class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links'
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      remember: false,
      uploading: false,
      result: [],
      isRefreshing: false
    };
  }

  componentWillMount() {
    this.setState({ result: [] });
    if (this.state.uploading === false) {
      this.setState({ uploading: true });
    }

    this.getCurrentUserName();
    setTimeout(() => {
      this.props.fetchCurrentUserLoadedImages(this.state.username);
    }, 2000);
  }

  componentWillReceiveProps(nextprops) {
    console.log(nextprops);
    if (nextprops.errMess === null) {
      console.log('In component');
      const json = nextprops.data.val();
      // const myObj = {
      //   key: Object.keys(json)[0],
      //   name: Object.values(json)[0].user,
      //   url: Object.values(json)[0].url,
      //   date: Object.values(json)[0].date
      // };

      console.log('home');
      Object.values(json).map(item => {
        console.log(i);
        const myObj = {
          key: Object.keys(json)[i],
          name: item.user,
          url: item.url,
          date: item.date
        };
        const myObjStr = JSON.stringify(myObj);
        // console.log(myObjStr);
        myData.push(myObjStr);
        i++;
      });
      this.setState({ result: this.state.result.concat(myData) });
      // console.log(this.state.result);
      myData = [];
      i = 0;

      // console.log(nextprops.data.val());
      // console.log(Object.keys(json)); //returning an array of keys, in this case ["-Lhdfgkjd6fn3AA-"]
      // console.log(Object.keys(json)[0]);
      // console.log(Object.values(json)); //returning an array of values of property
      // console.log(Object.values(json)[0].user); //this.props.data = [];

      //
    } else if (this.state.uploading) {
      this.setState({ uploading: false });
    }
  }

  componentWillUnmount() {
    console.log('Unmount');
    this.setState({ result: [] });
    //   this.setState({ uploading: false });
    this.props = null;
  }

  onRefresh = () => {
    this.setState({ result: [] });
    this.setState({ isRefreshing: true });

    setTimeout(() => {
      this.props.fetchCurrentUserLoadedImages(this.state.username);
      if (this.state.uploading === false) {
        this.setState({ uploading: true });
      }
    }, 1000);
    setTimeout(() => {
      this.setState({ isRefreshing: false });
      console.log(this.state.isRefreshing);
    }, 2000);
  };

  getCurrentUserName() {
    SecureStore.getItemAsync('userinfo').then(userdata => {
      const userinfo = JSON.parse(userdata);
      if (userinfo) {
        console.log(userinfo.username);
        this.setState({ username: userinfo.username });
      }
    });
  }

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // this.getCurrentUserName();
    const user = this.state.username;
    console.log(user);
    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      const capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      try {
        if (!capturedImage.cancelled) {
          if (this.state.uploading === false) {
            this.setState({ uploading: true });
          }
          console.log('ggg');
          const uploadUrl = await this.uploadImageAsync(capturedImage.uri, user);
          //  this.processImage(capturedImage.uri);
        }
      } catch (e) {
        console.log(e);
        Alert.alert('Upload failed, sorry :(');
      } finally {
        //  this.setState({ uploading: false });
      }
    }
  };

  pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    const user = this.state.username;
    console.log(user);
    try {
      if (!result.cancelled) {
        if (this.state.uploading === false) {
          this.setState({ uploading: true });
        }
        console.log('ehgfh');
        const uploadUrl = await this.uploadImageAsync(result.uri, user);
        console.log('uploadUrl');
        //  this.processImage(result.uri);
      }
    } catch (e) {
      console.log('failed');
      Alert.alert('Upload failed, sorry :(');
    } finally {
      //this.setState({ uploading: false });
    }
    // }
  };

  async uploadUrlToDatabase(url, user) {
    const firebase = require('firebase');

    const date = new Date().toLocaleString();

    console.log(user);
    firebase
      .database()
      .ref('images/')
      .push({
        user,
        url,
        date
      })
      .then(() => {
        console.log('success');

        //
      });
  }

  async uploadImageAsync(uri, user) {
    const firebase = require('firebase');

    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
    console.log('uploadImageAsync');
    const snapshot = await ref.put(blob);
    // console.log('uploadUrl');
    snapshot.ref.getDownloadURL().then(url => {
      this.setState({ result: [] });
      this.uploadUrlToDatabase(url, user);

      console.log(url);
    });
    return snapshot.downloadURL;
  }

  maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
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

  dataDeleteConfirmation(key, url) {
    Alert.alert('Delete Images', 'Are you sure you want to delete this images?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: 'yes',
        onPress: () => this.deleteImages(key, url)
      }
    ]);
  }

  deleteImages(key, url) {
    const firebase = require('firebase');

    if (this.state.uploading === false) {
      this.setState({ uploading: true });
    }
    const desertRef = firebase.storage().refFromURL(url);

    // Delete the file
    desertRef
      .delete()
      .then(() => {
        console.log('File deleted successfully');
      })
      .catch(error => {
        console.log(error);
        // Uh-oh, an error occurred!
      });

    firebase
      .database()
      .ref('images/')
      .child(key)
      .remove()
      .then(() => {
        this.setState({ result: [] });
        this.props.fetchCurrentUserLoadedImages(this.state.username);

        console.log(key);
      })
      .catch(error => Alert.alert('Error', 'Could not delete Image. Try Again'));
    console.log(key);
  }

  render() {
    const noData = () => {
      if (this.props.errMess != null) {
        // this.setState({ isLoading: !this.state.uploading });
        return (
          <View style={styles.noDataFound}>
            <Text style={styles.textStyleOfNoDataFound}>{this.props.errMess}</Text>
          </View>
        );
      }
    };
    const RenderData = data => {
      //  console.log(this.state.result);\

      if (data != null) {
        return (
          <FlatList
            inverted
            data={data}
            renderItem={renderUserCard}
            keyExtractor={item => item.toString()}

            //
          />
        );
      }
    };

    const renderUserCard = ({ item }) => {
      const fff = JSON.parse(item);
      if (this.state.uploading) {
        this.setState({ uploading: false });
      }
      return (
        <View>
          <Tile
            titleStyle={{ alignItems: 'center' }}
            iconContainerStyle={{
              marginBottom: 190,
              marginLeft: 250
            }}
            onLongPress={() => this.dataDeleteConfirmation(fff.key, fff.url)}
            containerStyle={{ flex: 1 }}
            imageSrc={{ uri: fff.url }}
            title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores dolore exercitationem"
            contentContainerStyle={{ height: 70 }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text>{fff.name}</Text>
            <Text>{fff.date}</Text>
          </View>
        </View>
      );
    };
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Button title="Camera" onPress={this.getImageFromCamera} />
            <Button title="Gallery" onPress={this.pickImageFromGallery} />
          </View>
          {this.maybeRenderUploadingOverlay()}
          <View style={{ flex: 1, justifyContent: 'center', marginTop: 20 }}>
            {RenderData(this.state.result)}
            {noData()}
          </View>
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
  },
  noDataFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyleOfNoDataFound: {
    fontSize: 20,
    fontStyle: 'bold'
  }
});

const mapStateToProps = state => {
  const { isLoading, errMess, data } = state.currentUser;
  //  console.log(state.currentUser.data.date);
  return { isLoading, errMess, data };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchCurrentUserLoadedImages, noCurrentUserDataFound, currentUserLoading }
)(LinksScreen);
