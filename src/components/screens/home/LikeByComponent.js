import React from 'react';
import { Text, FlatList, View } from 'react-native';
import { Card } from 'react-native-elements';

let myLikeUser = [];

class LikeByComponent extends React.Component {
  static navigationOptions = {
    headerStyle: { height: 40, backgroundColor: '#512DA8' },
    title: 'LikeBy',
    headerTintColor: '#fff'
  };

  constructor(props) {
    super(props);
    // console.log('constructor');
    this.state = {
      likedUserList: []
    };
  }

  componentWillMount() {
    myLikeUser = [];
    this.noOfLikesForEachKey();
  }

  async noOfLikesForEachKey() {
    const firebase = require('firebase');

    const key = this.props.navigation.state.params.key;
    console.log('key', key);
    const imagesRef = firebase.database().ref('like/');

    return imagesRef
      .orderByChild('key')
      .equalTo(key)
      .on('value', data => {
        if (data.exists()) {
          const json = data.val();

          Object.values(json).map(item => {
            myLikeUser.push(item.byUser);
          });
          this.setState({ likedUserList: myLikeUser });
        } else {
          this.setState({ likedUserList: [] });
        }
      });
  }

  render() {
    const RenderData = data => {
      if (data.length !== 0 && data != null) {
        return (
          <FlatList
            inverted
            data={data}
            renderItem={renderUserCard}
            keyExtractor={item => item.toString()}
          />
        );
      }
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: '50%' }}>
          <Text style={{ fontSize: 20 }}>No Likes</Text>
        </View>
      );
    };

    const renderUserCard = ({ item }) => (
      <Card wrapperStyle={{ width: '100%' }} containerStyle={{ margin: 0 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item}</Text>
      </Card>
    );
    console.log(this.state.likedUserList);
    return <View>{RenderData(this.state.likedUserList)}</View>;
  }
}

export default LikeByComponent;
