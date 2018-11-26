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

const myData = [];

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
    this.setState({ uploading: true });
    console.log('mount');
    setTimeout(() => {
      this.props.fetchUser();
    }, 2000);
  }

  componentWillReceiveProps(nextprops) {
    const myObj = {
      key: nextprops.data.key,
      name: nextprops.data.val().user,
      url: nextprops.data.val().url,
      date: nextprops.data.val().date
    };

    const myObjStr = JSON.stringify(myObj);
    // myData.push(myObjStr);
    this.props.data = [];
    this.setState({ result: this.state.result.concat(myObjStr) });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    return true;
  }

  componentWillUnmount() {
    console.log('Unmount');
    this.setState({ result: [] });
    this.setState({ uploading: false });
  }

  onRefresh = () => {
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
      this.setState({ uploading: false });
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
