import * as ActionTypes from '../../../constants/ActionTypes';

const list = [];

export const fetchUser = () => dispatch => {
  const firebase = require('firebase');

  const playersRef = firebase.database().ref('images/');

  return playersRef.orderByKey().on('value', data => {
    dispatch(addLeaders(data));
  });
};

export const addLeaders = data => ({
  type: ActionTypes.FETCH_IMAGES,
  payload: data
});

export const fetchLikedImagesKey = username => dispatch => {
  const firebase = require('firebase');

  console.log('fetching liked images like');
  const imagesRef = firebase.database().ref('like/');
  return imagesRef
    .orderByChild('byUser')
    .equalTo(username)
    .on('value', data => {
      if (data.exists()) {
        dispatch(sendLikedImagesKey(data));
      } else {
        dispatch(sendNoLikedImagesKey());
      }
    });
};

export const sendLikedImagesKey = data => ({
  type: ActionTypes.LIKED_IMAGES_KEY,
  payload: data
});

export const sendNoLikedImagesKey = () => ({
  type: ActionTypes.LIKED_IMAGES_KEY,
  payload: []
});

export const keyForTotalNoOfLikes = () => dispatch => {
  const firebase = require('firebase');

  const playersRef = firebase.database().ref('images/');
  playersRef
    .orderByKey()
    .on('child_added', data => {
      console.log(data.key);
      dispatch(noOfLikesForEachKey(data.key));
    })
    .then(() => {
      console.log('searching');
      dispatch(sendNoOfLikes());
    });
};
export const noOfLikesForEachKey = key => {
  const firebase = require('firebase');

  //dispatch(currentUserLoading());
  const imagesRef = firebase.database().ref('like/');

  return imagesRef
    .orderByChild('key')
    .equalTo(key)
    .on('value', data => {
      console.log('kk');
      if (data.exists()) {
        list.concat(data.numChildren());
        console.log(list);
      } else {
        list.concat(0);
      }
    });
};

export const sendNoOfLikes = () => ({
  type: ActionTypes.NO_OF_LIKED_IMAGES_FOR_EACH_KEY,
  payload: list
});
