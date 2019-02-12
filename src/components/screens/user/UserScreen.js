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
  RefreshControl,
  Modal,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { Button, Tile, Input, Icon } from 'react-native-elements';
import { SecureStore, Permissions, ImagePicker } from 'expo';

import HeaderComponentWithIcon from '../../../utility/HeaderComponentWithIcon';

import {
  fetchCurrentUserLoadedImages,
  noCurrentUserDataFound,
  currentUserLoading
} from './UserActionCreators';
import { ShowImage } from '../../../utility/ShowImage';
import ShowVideo from '../../../utility/ShowVideo';

let myData = [];
let i = 0;

class UserScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      remember: false,
      uploading: false,
      result: [],
      isRefreshing: false,
      imageNotCancelled: false,
      uri: '',
      showModal: false,
      caption: '',
      type: '',
      userProfileImageUrl: ''
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
    if (nextprops.errMess === null) {
      this.setState({ result: [] });
      myData = [];

      const json = nextprops.data.val();
      // const myObj = {
      //   key: Object.keys(json)[0],
      //   name: Object.values(json)[0].user,
      //   url: Object.values(json)[0].url,
      //   date: Object.values(json)[0].date
      // };

      console.log(nextprops.data);
      const dataKey = Object.keys(json);
      //  nextprops.data = [];
      i = 0;
      Object.values(json).map(item => {
        const myObj = {
          key: dataKey[i],
          name: item.user,
          url: item.url,
          date: item.date,
          caption: item.caption,
          type: item.type
        };
        const myObjStr = JSON.stringify(myObj);

        myData.push(myObjStr);
        i++;
      });

      this.setState({ result: myData });

      setTimeout(() => {
        myData = [];
        i = 0;
      }, 1000);
    } else if (this.state.uploading) {
      this.setState({ uploading: false });
      this.setState({ result: [] });
    }
  }

  componentWillUnmount() {
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
    }, 2000);
  };

  getCurrentUserName() {
    SecureStore.getItemAsync('userinfo').then(userdata => {
      const userinfo = JSON.parse(userdata);
      if (userinfo) {
        this.setState({ username: userinfo.username });
        this.setState({ userProfileImageUrl: userinfo.userProfileImageUrl });
      }
    });
  }

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // this.getCurrentUserName();
    const user = this.state.username;
    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      const capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        mediaTypes: 'All'
      });

      if (!capturedImage.cancelled) {
        console.log(capturedImage.type);
        this.setState({ showModal: true, uri: capturedImage.uri, type: capturedImage.type });
        // const uploadUrl = await this.uploadImageAsync(capturedImage.uri, user);
        //  this.processImage(capturedImage.uri);
      }
    }
  };

  pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: 'All'
    });

    if (!result.cancelled) {
      console.log(result.type);
      this.setState({ showModal: true, uri: result.uri, type: result.type });
    }

    // }
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal, caption: '' });
  }

  addStatus = async () => {
    if (this.state.uploading === false) {
      this.setState({ uploading: true });
    }
    const user = this.state.username;
    this.toggleModal();
    try {
      const uploadUrl = await this.uploadImageAsync(
        this.state.uri,
        user,
        this.state.caption,
        this.state.type,
        this.state.userProfileImageUrl
      );
      console.log('uploadUrl');
    } catch (e) {
      Alert.alert('Upload failed, sorry :(');
    } finally {
      if (this.state.uploading) {
        this.setState({ uploading: false });
      }
    }
  };

  async uploadUrlToDatabase(url, user, caption, type, userProfileImageUrl) {
    const firebase = require('firebase');

    const date = new Date().toLocaleString();

    firebase
      .database()
      .ref('images/')
      .push({
        user,
        url,
        date,
        caption,
        type,
        userProfileImageUrl
      })
      .then(() => {
        console.log('success');
        if (this.state.uploading) {
          this.setState({ uploading: false });
        }
        //
      });
  }

  async uploadImageAsync(uri, user, caption, type, userProfileImageUrl) {
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
      this.setState({ result: [] });
      this.uploadUrlToDatabase(url, user, caption, type, userProfileImageUrl);

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
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
  };

  dataDeleteConfirmation(key, url) {
    Alert.alert('Delete Images', 'Are you sure you want to delete this images?', [
      {
        text: 'No',
        style: 'cancel'
      },
      {
        text: 'yes',
        onPress: () => this.deleteImages(key, url)
      }
    ]);
  }

  deleteImages(key, url) {
    myData = [];
    i = 0;
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
        if (this.state.uploading) {
          this.setState({ uploading: false });
        }
        // Uh-oh, an error occurred!
      });

    firebase
      .database()
      .ref('images/')
      .child(key)
      .remove()
      .then(() => {
        //   this.setState({ result: [] });
        // this.props.fetchCurrentUserLoadedImages(this.state.username);
      })
      .catch(error => {
        Alert.alert('Error', 'Could not delete Image. Try Again');
        if (this.state.uploading) {
          this.setState({ uploading: false });
        }
      });
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
      if (fff.type === 'video') {
        return (
          <View>
            <ShowVideo
              ondata={() => this.dataDeleteConfirmation(fff.key, fff.url)}
              caption={fff.caption}
              url={fff.url}
            />

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ width: 120 }}>
                <Text style={{ fontWeight: 'bold', color: 'blue' }}>{fff.name}</Text>
              </View>
              <Text style={{ fontWeight: 'bold', color: 'blue' }}>{fff.date}</Text>
            </View>
          </View>
        );
      }
      return (
        <View>
          <ShowImage
            ondata={() => this.dataDeleteConfirmation(fff.key, fff.url)}
            caption={fff.caption}
            url={fff.url}
          />

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <Text style={{ fontWeight: 'bold', color: 'blue' }}>{fff.date}</Text>
          </View>
        </View>
      );
    };
    return (
      <View>
        <HeaderComponentWithIcon headerText="Upload" />

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
            <View style={{ flex: 1, justifyContent: 'center', marginTop: 20, marginBottom: 40 }}>
              {RenderData(this.state.result)}
              {noData()}
            </View>
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
                <Image
                  style={{ width: '100%', height: '50%', marginBottom: 5 }}
                  source={{ uri: this.state.uri }}
                />
                <Input
                  inputStyle={{ color: 'white' }}
                  style={styles.modalText}
                  placeholder="Add Caption"
                  onChangeText={caption => this.setState({ caption })}
                  leftIcon={<Icon name="user-o" type="font-awesome" size={24} color="white" />}
                />
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: 'column',
                    marginRight: 10,
                    marginLeft: 10
                  }}
                >
                  <Button
                    style={styles.modalText}
                    onPress={
                      this.addStatus
                      //  this.postNewComment(dishId);
                    }
                    buttonStyle={{
                      backgroundColor: '#ffffff'
                    }}
                    titleStyle={{
                      color: 'blue'
                    }}
                    title="Update Status"
                  />
                </View>
                <View
                  style={{
                    marginTop: 30,
                    flexDirection: 'column',
                    marginRight: 10,
                    marginLeft: 10
                  }}
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
    fontSize: 20
    //  fontStyle: 'bold'
  },
  modal: {
    justifyContent: 'center',
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20
  },
  dialog: {
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white'
  },
  modalText: {
    fontSize: 18,
    margin: 10,
    color: 'white'
  }
});

const mapStateToProps = state => {
  const { isLoading, errMess, data } = state.currentUser;
  return { isLoading, errMess, data };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchCurrentUserLoadedImages, noCurrentUserDataFound, currentUserLoading }
)(UserScreen);
