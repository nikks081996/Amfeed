import * as ActionTypes from './ActionTypes';

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
    // console.log(data);
    dispatch(addLeaders(data));
  });
};

export const fetchCurrentUserLoadedImages = username => dispatch => {
  const firebase = require('firebase');

  //dispatch(currentUserLoading());
  const playersRef = firebase.database().ref('images/');
  console.log('reducers');
  return playersRef
    .orderByChild('user')
    .equalTo(username)
    .on('value', data => {
      if (data.exists()) {
        //console.log(data);
        dispatch(addCurrentUserData(data));
      } else {
        dispatch(noCurrentUserDataFound());
      }
    });
  //   .catch(errorMessage => console.log(errorMessage));
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
