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
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { Button, Tile, ListItem, Card, Icon } from 'react-native-elements';
import { SecureStore, Permissions, ImagePicker } from 'expo';

import { fetchUser, fetchLikedImagesKey, keyForTotalNoOfLikes } from './HomeActionCreators';
import { ShowImage } from '../../../utility/ShowImage';
import ShowVideo from '../../../utility/ShowVideo';
import { Actions } from 'react-native-router-flux';

let myData = [];
let myLikeKeyList = [];
let i = 0;

let oldKeys = [];
let newKeys = [];
let deleteKeys = null;
const favorite = false;
let keyss = '';
let list = [];
let like = 0;

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    // console.log('constructor');
    this.state = {
      username: '',
      remember: false,
      uploading: false,
      result: [],
      name: [],
      url: [],
      date: [],
      isRefreshing: false,
      likedImagesList: [],
      noOfLikes: [],
      likeee: 0
    };
  }

  componentWillMount() {
    // this.setState({ result: [] });
    console.log('mount');
    oldKeys = [];
    list = [];
    //debugger;
    this.setState({ result: [] });
    // console.log(this.state.result);
    //debugger;

    if (this.state.uploading === false) {
      this.setState({ uploading: true });
    }
    this.getCurrentUserName();
    //console.log('calling');
    setTimeout(() => {
      this.totalLikes();
      this.fetchLikedImage();
      this.fetchUser();
    }, 2000);
  }

  getCurrentUserName() {
    SecureStore.getItemAsync('userinfo').then(userdata => {
      const userinfo = JSON.parse(userdata);
      if (userinfo) {
        this.setState({ username: userinfo.username });
      }
      console.log('ff', userinfo.userProfileImageUrl);
    });
  }

  componentWillReceiveProps(nextprops) {
    //debugger;
    //  console.log(nextprops.data);
    if (nextprops.likeImagesKey.length !== 0) {
      //console.log('length');
      const json = nextprops.likeImagesKey.val();

      Object.values(json).map(item => {
        myLikeKeyList.push(item.key);
      });
      this.setState({ likedImagesList: myLikeKeyList });
      // setTimeout(() => {
      //   console.log('images', this.state.likedImagesList);
      // }, 2000);
      myLikeKeyList = [];
    }

    console.log('errmessssss', nextprops.errMess);
    if (nextprops.errMess === null) {
      console.log('result', this.state.result);
      myData = [];
      const json = nextprops.data.val();
      // console.log('looo', json);
      // const myObj = {
      //   key: Object.keys(json)[0],
      //   name: Object.values(json)[0].user,
      //   url: Object.values(json)[0].url,
      //   date: Object.values(json)[0].date
      // };
      /// console.log('nextprops', nextprops.data.val());
      Object.values(json).map(item => {
        const myObj = {
          key: Object.keys(json)[i],
          name: item.user,
          url: item.url,
          date: item.date,
          caption: item.caption,
          type: item.type,
          userProfileImageUrl: item.userProfileImageUrl
        };
        const myObjStr = JSON.stringify(myObj);
        myData.push(myObjStr);
        i++;
      });
      //console.log('oldKeys.length', oldKeys.length);
      //console.log('this.state.result.length.length', this.state.result.length);

      if (oldKeys.length !== 0) {
        newKeys = Object.keys(json);
        // console.log(newKeys);
        //console.log(oldKeys);

        deleteKeys = checkForData(newKeys);
        //console.log('enter');
        // debugger;
        if (deleteKeys !== null) {
          console.log('deletekeys');
          const replacedData = this.state.result;
          replacedData.splice(deleteKeys, 1);
          this.setState({ result: replacedData });
          // setTimeout(() => {
          //   console.log('result', this.state.result);
          // }, 2000);
        }
      } else {
        //console.log('oldkeys', myData);
        // console.log('in nrew key');
        oldKeys = Object.keys(json);
        this.setState({ result: myData });
        // setTimeout(() => {
        //   console.log('result', this.state.result);
        // }, 2000);
      }
      //  console.log('mydata', myData);

      setTimeout(() => {
        myData = [];
        i = 0;
      }, 500);
    } else if (this.state.uploading) {
      this.setState({ uploading: false });
    }
    //console.log('result', this.state.result);
  }

  componentWillUnmount() {
    console.log('unmount');
    oldKeys = [];
    list = [];
    this.setState({ result: [] });
    if (this.state.uploading) {
      this.setState({ uploading: false });
    }
  }

  onRefresh = () => {
    oldKeys = [];
    list = [];
    this.setState({ result: [] });
    this.setState({ isRefreshing: true });

    setTimeout(() => {
      this.fetchLikedImage();
      this.fetchUser();
    }, 1000);
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 2000);
  };

  async fetchLikedImage() {
    await this.props.fetchLikedImagesKey(this.state.username);
  }

  async fetchUser() {
    await this.props.fetchUser();
  }

  async totalLikes() {
    const firebase = require('firebase');

    const playersRef = firebase.database().ref('images/');
    playersRef.orderByKey().on('child_added', data => {
      this.call(data.key);
    });
  }
  async call(key) {
    await this.noOfLikesForEachKey(key);
  }
  async noOfLikesForEachKey(key) {
    const firebase = require('firebase');

    const imagesRef = firebase.database().ref('like/');

    return imagesRef
      .orderByChild('key')
      .equalTo(key)
      .on('value', data => {
        if (data.exists()) {
          const myObj = {
            key,
            likes: data.numChildren()
          };
          const myObjStr = JSON.stringify(myObj);
          list.push(myObjStr);
          this.setState({
            noOfLikes: list
          });
        } else {
          const myObj = {
            key,
            likes: 0
          };
          const myObjStr = JSON.stringify(myObj);
          list.push(myObjStr);
          this.setState({
            noOfLikes: list
          });
        }
      });
  }

  likeImage = (key, byUser) => {
    const firebase = require('firebase');

    firebase
      .database()
      .ref('like')
      .push({
        key,
        byUser
      })
      .then(() => {
        console.log('success');
      })
      .catch(error => {});
  };

  dislike = key => {
    const firebase = require('firebase');

    console.log('hello');
    firebase
      .database()
      .ref('like')
      .orderByChild('key')
      .equalTo(key)
      .on('value', data => {
        if (keyss !== '') {
          //console.log('in dislike');
          let json = data.val();
          if (json !== null) {
            keyss = Object.keys(json)[0];
            this.finallyDelete(keyss);
          }
          json = null;
          console.log('Unliked Images from firebase also');
        }
      });
  };

  finallyDelete(key) {
    const firebase = require('firebase');

    firebase
      .database()
      .ref('like/')
      .child(key)
      .remove()
      .then(() => {
        keyss = '';
      });
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

  render() {
    const getUpdatedSelectedItemsArray = id => {
      if (this.state.likedImagesList.includes(id)) {
        const array = this.state.likedImagesList;
        const index = array.indexOf(id);
        array.splice(index, 1);
        //if id already exists delete it
        // this.setState({
        //   likedImagesList: array
        // });
        // console.log('inside');
        keyss = 'gh';
        this.dislike(id);
      } else {
        // this.setState({
        //   likedImagesList: this.state.likedImagesList.concat(id)
        // });
        const byUser = this.state.username;
        this.likeImage(id, byUser);
      }
    };
    const RenderData = data => {
      // console.log('data', data);
      //debugger;
      if (data != null) {
        // console.log('data', data);
        return (
          <FlatList
            inverted
            data={data}
            extraData={this.state}
            renderItem={renderUserCard}
            keyExtractor={item => item.toString()}
          />
        );
      }
    };

    const renderUserCard = ({ item }) => {
      const fff = JSON.parse(item);
      if (this.state.uploading) {
        this.setState({ uploading: false });
      }

      this.state.noOfLikes.some(todo => {
        const c = JSON.parse(todo);
        if (c.key === fff.key) {
          like = c.likes;
        }
      });
      if (fff.type === 'video') {
        return (
          <Card wrapperStyle={{ width: '100%' }} containerStyle={{ margin: 0 }}>
            <ListItem
              leftAvatar={
                fff.userProfileImageUrl === '' || fff.userProfileImageUrl === undefined
                  ? { title: fff.name[0] }
                  : { source: { uri: fff.userProfileImageUrl } }
              }
              title={fff.name}
              subtitle={fff.date}
              chevron
            />

            <ShowVideo url={fff.url} caption={fff.caption} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'column' }}>
                <Icon
                  raised
                  reverse
                  name={this.state.likedImagesList.some(el => el === fff.key) ? 'heart' : 'heart-o'}
                  type="font-awesome"
                  color="#f50"
                  onPress={() => {
                    getUpdatedSelectedItemsArray(fff.key);
                  }}
                />
                <TouchableOpacity
                  style={{ alignSelf: 'center' }}
                  onPress={() => {
                    console.log('navigating');
                    this.props.navigation.navigate('LikeByComponent', { key: fff.key });
                  }}
                >
                  <Text>{like} likes</Text>
                </TouchableOpacity>
              </View>
              <Icon raised reverse name="pencil" type="font-awesome" color="#002AD9" />
            </View>
          </Card>
        );
      }
      // console.log('imah', fff.userProfileImageUrl);
      return (
        <Card wrapperStyle={{ width: '100%' }} containerStyle={{ margin: 0 }}>
          <ListItem
            leftAvatar={
              fff.userProfileImageUrl === '' || fff.userProfileImageUrl === undefined
                ? { title: fff.name[0] }
                : { source: { uri: fff.userProfileImageUrl } }
            }
            title={fff.name}
            subtitle={fff.date}
            chevron
          />

          <ShowImage caption={fff.caption} url={fff.url} />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column' }}>
              <Icon
                raised
                reverse
                name={this.state.likedImagesList.some(el => el === fff.key) ? 'heart' : 'heart-o'}
                type="font-awesome"
                color="#f50"
                onPress={() => {
                  getUpdatedSelectedItemsArray(fff.key);
                }}
              />
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={() => {
                  console.log('navigating');
                  this.props.navigation.navigate('LikeByComponent', { key: fff.key });
                }}
              >
                <Text>{like} likes</Text>
              </TouchableOpacity>
            </View>
            <Icon raised reverse name="pencil" type="font-awesome" color="#002AD9" />
          </View>
        </Card>
      );
    };
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh} />
        }
      >
        <View style={styles.container}>
          {this.maybeRenderUploadingOverlay()}
          <View style={{ flex: 1, justifyContent: 'center', marginTop: 20 }}>
            {RenderData(this.state.result)}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const checkForData = newDataKeys => {
  for (i = 0; i < oldKeys.length; i++) {
    if (!newDataKeys.includes(oldKeys[i])) {
      oldKeys.splice(i, 1);
      return i;
    }
  }
  return null;
};

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
  const { isLoading, errMess, data, likeImagesKey, noOfLikes } = state.user;
  return { isLoading, errMess, data, likeImagesKey, noOfLikes };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchUser, fetchLikedImagesKey, keyForTotalNoOfLikes }
)(HomeScreen);
