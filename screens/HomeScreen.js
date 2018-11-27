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

import { fetchUser } from '../src/redux/Action/ActionCreators';

let myData = [];
let i = 0;

let oldKeys = [];
let newKeys = [];
let deleteKeys = null;

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
      isRefreshing: false
    };
  }

  componentWillMount() {
    this.setState({ result: [] });
    if (this.state.uploading === false) {
      this.setState({ uploading: true });
    }
    console.log('mount');
    setTimeout(() => {
      this.props.fetchUser();
    }, 2000);
  }

  componentWillReceiveProps(nextprops) {
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
      //this.setState({ result: [] });
      console.log('In component');
      const json = nextprops.data.val();
      // const myObj = {
      //   key: Object.keys(json)[0],
      //   name: Object.values(json)[0].user,
      //   url: Object.values(json)[0].url,
      //   date: Object.values(json)[0].date
      // };
      // console.log(nextprops);

      // check for oldKeys is  empty or not... if empty store all keys (it checks for first time)

      console.log('json');
      console.log(json);
      console.log('result');

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
      if (oldKeys.length !== 0) {
        console.log('in new keys');
        console.log(oldKeys.length);
        newKeys = Object.keys(json);
        deleteKeys = checkForData(newKeys);
        console.log('index');
        console.log(deleteKeys);
        if (deleteKeys !== null) {
          const replacedData = this.state.result;
          replacedData.splice(i, 1);
          this.setState({ result: replacedData });
        }
      } else {
        console.log('in old keys');
        oldKeys = Object.keys(json);
        this.setState({ result: myData });
      }
      // console.log(this.state.result);

      // this.setState({ result: myData });

      setTimeout(() => {
        myData = [];
        i = 0;
      }, 2000);

      // console.log(this.state.result);

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
    if (this.state.uploading) {
      this.setState({ uploading: false });
    }
  }

  onRefresh = () => {
    oldKeys = [];
    this.setState({ result: [] });
    this.setState({ isRefreshing: true });

    setTimeout(() => {
      this.props.fetchUser();
    }, 1000);
    setTimeout(() => {
      this.setState({ isRefreshing: false });
      console.log(this.state.isRefreshing);
    }, 2000);
  };

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
    const RenderData = data => {
      if (data != null) {
        return (
          <FlatList
            inverted
            data={data}
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
      return (
        <View>
          <Tile
            titleStyle={{ alignItems: 'center' }}
            iconContainerStyle={{
              marginBottom: 190,
              marginLeft: 250
            }}
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
  console.log('newDataKeys');

  console.log(newDataKeys);
  console.log(oldKeys);
  for (i = 0; i < oldKeys.length; i++) {
    if (!newDataKeys.includes(oldKeys[i])) {
      console.log('delete key is');
      console.log(oldKeys[i]);
      oldKeys.splice(i, 1);
      console.log(oldKeys, i);
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
  const { isLoading, errMess, data } = state.user;
  // console.log(state.user.data);
  return { isLoading, errMess, data };
};

// connect to the actioncreators
export default connect(
  mapStateToProps,
  { fetchUser }
)(HomeScreen);
