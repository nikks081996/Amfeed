import * as ActionTypes from './ActionTypes';

const list = [];
export const userFetchingFailed = errorMessage => ({
  type: ActionTypes.IMAGES_LOADING_FAILED,
  payload: errorMessage
});

export const addImages = imagesUrl => ({
  type: ActionTypes.IMAGES_ADD,
  payload: imagesUrl
});

export const addCurrentUserImages = imagesUrl => ({
  type: ActionTypes.CURRENT_USER_IMAGES_ADD,
  payload: imagesUrl
});

export const userLoading = () => ({
  type: ActionTypes.IMAGES_LOADING,
  payload: null
});

export const currentUserLoading = () => ({
  type: ActionTypes.LOADING_CURRENT_USER_IMAGES,
  payload: null
});
//const obj = [];
export const fetchUser = () => dispatch => {
  const firebase = require('firebase');

  const playersRef = firebase.database().ref('images/');

  return playersRef.orderByKey().on('value', data => {
    dispatch(addLeaders(data));
  });
};

export const fetchCurrentUserLoadedImages = username => dispatch => {
  const firebase = require('firebase');

  //dispatch(currentUserLoading());
  const playersRef = firebase.database().ref('images/');
  return playersRef
    .orderByChild('user')
    .equalTo(username)
    .on('value', data => {
      if (data.exists()) {
        dispatch(addCurrentUserData(data));
      } else {
        dispatch(noCurrentUserDataFound());
      }
    });
};

export const addCurrentUserData = data => ({
  type: ActionTypes.FETCH_CURRENT_USER_IMAGES,
  payload: data
});

export const addLeaders = data => ({
  type: ActionTypes.FETCH_IMAGES,
  payload: data
});

export const noCurrentUserDataFound = () => ({
  type: ActionTypes.NO_CURRENT_USER_DATA_FOUND,
  payload: null
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
