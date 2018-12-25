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
import { Button, Tile, ListItem, Card, Icon } from 'react-native-elements';
import { SecureStore, Permissions, ImagePicker } from 'expo';

import {
  fetchUser,
  fetchLikedImagesKey,
  keyForTotalNoOfLikes
} from '../src/redux/Action/ActionCreators';
import { ShowImage } from './ShowImage';
import ShowVideo from './ShowVideo';

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
    this.setState({ result: [] });
    if (this.state.uploading === false) {
      this.setState({ uploading: true });
    }
    this.getCurrentUserName();
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
    });
  }

  componentWillReceiveProps(nextprops) {
    //console.log('solo', nextprops);

    if (nextprops.likeImagesKey.length !== 0) {
      //console.log('enter', nextprops.likeImagesKey.length);
      // this.setState({ likedImagesList: nextprops.likeImagesKey });
      const json = nextprops.likeImagesKey.val();

      Object.values(json).map(item => {
        myLikeKeyList.push(item.key);
      });
      this.setState({ likedImagesList: myLikeKeyList });
      myLikeKeyList = [];
    }
    //   const myObj = {
    //     key: nextprops.data.key,
    //     name: nextprops.data.val().user,
    //     url: nextprops.data.val().url,
    //     date: nextprops.data.val().date
    //   };

    //   const myObjStr = JSON.stringify(myObj);
    //   // myData.push(myObjStr);
    //   this.props.data = [];
    //   this.setState({ result: this.state.result.concat(myObjStr) });
    if (nextprops.errMess === null) {
      const json = nextprops.data.val();
      // const myObj = {
      //   key: Object.keys(json)[0],
      //   name: Object.values(json)[0].user,
      //   url: Object.values(json)[0].url,
      //   date: Object.values(json)[0].date
      // };

      Object.values(json).map(item => {
        const myObj = {
          key: Object.keys(json)[i],
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
      if (oldKeys.length !== 0) {
        newKeys = Object.keys(json);
        deleteKeys = checkForData(newKeys);

        if (deleteKeys !== null) {
          const replacedData = this.state.result;
          replacedData.splice(i, 1);
          this.setState({ result: replacedData });
        }
      } else {
        oldKeys = Object.keys(json);
        this.setState({ result: myData });
      }

      setTimeout(() => {
        myData = [];
        i = 0;
      }, 2000);
    } else if (this.state.uploading) {
      this.setState({ uploading: false });
    }
  }

  componentWillUnmount() {
    this.setState({ result: [] });
    if (this.state.uploading) {
      this.setState({ uploading: false });
    }
  }

  onRefresh = () => {
    console.log(this.state.noOfLikes[0]);
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
          }); // console.log('list', list);
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
          console.log('in dislike');
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
          <ActivityIndicator color="#fff" animating size="large" />
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
        console.log('inside');
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
      if (data != null) {
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
              leftAvatar={{ title: fff.name[0] }}
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
                <View style={{ alignSelf: 'center' }}>
                  <Text>{like} likes</Text>
                </View>
              </View>
              <Icon raised reverse name="pencil" type="font-awesome" color="#002AD9" />
            </View>
          </Card>
        );
      }
      return (
        <Card wrapperStyle={{ width: '100%' }} containerStyle={{ margin: 0 }}>
          <ListItem
            leftAvatar={{ title: fff.name[0] }}
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
              <View style={{ alignSelf: 'center' }}>
                <Text>{like} likes</Text>
              </View>
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
