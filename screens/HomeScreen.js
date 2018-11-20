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
  ToastAndroid,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import uuid from 'uuid';
//import RNFetchBlob from 'rn-fetch-blob';
import { Input, CheckBox, Button, Icon, Tile } from 'react-native-elements';
import { SecureStore, Camera, Permissions, Asset, ImagePicker, ImageManipulator } from 'expo';

import { fetchUser, addImages } from '../src/redux/Action/ActionCreators';

const myData = [];

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
      time: '',
      remember: false,
      uploading: false,
      result: [],
      name: [],
      url: [],
      date: [],
      isRefreshing: false
    };
  }

  componentWillMount() {
    // this.props.addImages("nikita");
    // console.log(this.props);
    //console.log(this.props.userName);
    console.log(this.props.navigation.getParam());
    this.setState({ result: [] });
    this.setState({ uploading: true });
    console.log('mount');
    setTimeout(() => {
      //Start the timer
      //  this.props.fetchUser();

      this.getCurrentUserName();
      this.props.fetchUser(); //After 1 second, set render to true
    }, 2000);
    // this.setState({ username: this.props.userName });
  }

  componentWillReceiveProps(nextprops) {
    // console.log('getting data');
    //  console.log(nextprops.data.key);
    // const j = [];
    // j.push(nextprops.data.val().user);
    // j.push(nextprops.data.val().url);
    // j.push(nextprops.data.val().date);
    // this.setState({ url: this.state.url.concat(nextprops.data.val().url) });
    // this.setState({ name: this.state.name.concat(nextprops.data.val().user) });
    // this.setState({ date: this.state.date.concat(nextprops.data.val().date) });

    const myObj = {
      key: nextprops.data.key,
      name: nextprops.data.val().user,
      url: nextprops.data.val().url,
      date: nextprops.data.val().date
    };

    const myObjStr = JSON.stringify(myObj);
    myData.push(myObjStr);
    // console.log(myData[0].url);
    // console.log(myObjStr);
    this.setState({ result: this.state.result.concat(myObjStr) });
    // this.setState({ result: this.state.result.push(nextprops.data.val().url) });
    // this.setState({ result: this.state.result.push(nextprops.data.val().date) });
  }

  componentWillUnmount() {
    console.log('Unmount');
    this.setState({ result: [] });
    this.setState({ uploading: false });
  }

  getImageFromCamera = async () => {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    this.getCurrentUserName();
    const user = this.state.username;
    console.log(user);
    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
      const capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      try {
        if (!capturedImage.cancelled) {
          this.setState({ uploading: true });
          console.log('ggg');
          const uploadUrl = await this.uploadImageAsync(capturedImage.uri, user);
          // console.log('uploadUrl');
          this.processImage(capturedImage.uri);
        }
      } catch (e) {
        console.log(e);
        Alert.alert('Upload failed, sorry :(');
      } finally {
        this.setState({ uploading: false });
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
    //console.log(processedImage);
    //this.getUri(processedImage.uri);
    // this.props.addImages(processedImage.uri);
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
    // const user = this.state.username;
    // console.log(user);

    const user = this.state.username;
    console.log(user);
    try {
      if (!result.cancelled) {
        this.setState({ uploading: true });
        console.log('ehgfh');

        const uploadUrl = await this.uploadImageAsync(result.uri, user);
        console.log('uploadUrl');
        this.processImage(result.uri);
      }
    } catch (e) {
      console.log('failed');
      Alert.alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
    // }
  };

  // getCurrentTime() {
  //   // Creating Date() function object.
  //   const date = new Date();
  //   let TimeType;
  //   let hour;
  //   let minutes;
  //   let seconds;
  //   // Getting current hour from Date object.
  //   hour = date.getHours();
  //   // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
  //   if (hour <= 11) {
  //     TimeType = 'AM';
  //   } else {
  //     // If the Hour is Not less than equals to 11 then Set the Time format as PM.
  //     TimeType = 'PM';
  //   }
  //   // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
  //   if (hour > 12) {
  //     hour -= 12;
  //   }
  //   // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format.
  //   if (hour == 0) {
  //     hour = 12;
  //   }
  //   // Getting the current minutes from date object.
  //   minutes = date.getMinutes();
  //   // Checking if the minutes value is less then 10 then add 0 before minutes.
  //   if (minutes < 10) {
  //     minutes = `0${minutes.toString()}`;
  //   }
  //   //Getting current seconds from date object.
  //   seconds = date.getSeconds();
  //   // If seconds value is less than 10 then add 0 before seconds.
  //   if (seconds < 10) {
  //     seconds = `0${seconds.toString()}`;
  //   }
  //   // Adding all the variables in fullTime variable.
  //   const fullTime = `${hour.toString()}:${minutes.toString()}:${seconds.toString()} ${TimeType.toString()}`;
  //   // Setting up fullTime variable in State.
  //   this.setState({
  //     time: fullTime
  //   });
  // }

  async uploadUrlToDatabase(url, user) {
    const firebase = require('firebase');

    //  console.log(this.state.username);

    // this.getCurrentUserName();
    // const user = this.state.username;
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
        this.props.addImages(url);
        //this.setState({ loading: !this.state.loading });
        //   this.changeLoadingState.bind(this);
        //  this.successOrNot();
        //Actions.AppNavigator();
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

  dataDelete(key) {
    Alert.alert('Delete Images', 'Are you sure you want to delete this images?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: 'yes',
        onPress: () => this.deleteImages(key)
      }
    ]);
  }

  deleteImages(key) {
    const firebase = require('firebase');

    firebase
      .database()
      .ref('images/')
      .child(key)
      .remove()
      .then(() => {
        this.setState({ result: [] });
        this.props.fetchUser();
        console.log(key);
      });
    console.log(key);

    // this.props.fetchUser();
  }

  fetchData() {
    //then(() => this.setState({ isRefreshing: !this.state.isRefreshing }));
  }

  // onRefresh = () => {
  //   this.setState({ isRefreshing: false });

  //   // Simulate fetching data from the server
  //   this.fetchData();
  // };

  onRefresh = () => {
    this.setState({ result: [] });
    //debugger;
    this.setState({ isRefreshing: true });
    //this.props.fetchUser();
    //this.setState({ isRefreshing: false });

    setTimeout(() => {
      //Start the timer
      this.props.fetchUser();
      // this.setState({ isRefreshing: false }); //After 1 second, set render to true
    }, 1000);
    setTimeout(() => {
      //Start the timer
      //  this.props.fetchUser();

      this.setState({ isRefreshing: false });
      console.log(this.state.isRefreshing); //After 1 second, set render to true
    }, 2000);
    // this.fetchData().then(() => {
    //   this.setState({ isRefreshing: false });
    // });
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
  render() {
    // console.log('properties');
    // console.log(this.props.userName);

    const RenderData = data => {
      //  console.log('New Data');
      // console.log(data);

      //console.log(data);
      //  const data = this.state.url;
      if (data != null) {
        //  this.setState({ uploading: false });
        //  console.log('data');
        // console.log(JSON.stringify(data));
        // const myObjStr = JSON.parse(data);
        // console.log(data);
        // const myObjStr = JSON.parse(data);
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

    const renderUserCard = ({ item, index }) => {
      //  console.log('hello');
      //console.log(item);
      const fff = JSON.parse(item);
      this.setState({ uploading: false });
      // console.log(fff.name);
      // this.setState({ uploading: false });
      // const key = item.key;
      // console.log(item.key.url);
      return (
        <View>
          <Tile
            titleStyle={{ alignItems: 'center' }}
            //key={item}
            icon={{
              name: 'trash',
              type: 'font-awesome',
              color: '#f50'
              // onPress: console.log('hello')
            }}
            iconContainerStyle={{
              marginBottom: 190,
              marginLeft: 250
            }}
            onLongPress={() => this.dataDelete(fff.key)}
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
    //  console.log('result');

    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: this.state.imageUrl }} style={styles.image} />
            <Button title="Camera" onPress={this.getImageFromCamera} />
            <Button title="Gallery" onPress={this.pickImageFromGallery} />
          </View>
          {this.maybeRenderUploadingOverlay()}
          <View style={{ flex: 1, justifyContent: 'center', marginTop: 20 }}>
            {RenderData(this.state.result)}
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
  }
});

const mapStateToProps = state => {
  const { isLoading, errMess, data } = state.user;
  // console.log(state.user.data);
  return { isLoading, errMess, data };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchUser, addImages }
)(HomeScreen);
