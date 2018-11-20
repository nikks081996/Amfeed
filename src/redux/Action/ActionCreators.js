import { Actions } from 'react-native-router-flux';
import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../Url/baseUrl';

export const userFetchingFailed = errorMessage => ({
  type: ActionTypes.IMAGES_LOADING_FAILED,
  payload: errorMessage
});

export const addImages = imagesUrl => ({
  type: ActionTypes.IMAGES_ADD,
  payload: imagesUrl
});

export const userLoading = () => ({
  type: ActionTypes.IMAGES_LOADING,
  payload: null
});
//const obj = [];
export const fetchUser = () => dispatch => {
  const firebase = require('firebase');

  const playersRef = firebase.database().ref('images/');

  return playersRef.orderByKey().on('child_added', data => {
    dispatch(addLeaders(data));
  });
};

export const addLeaders = data => ({
  type: ActionTypes.FETCH_IMAGES,
  payload: data
});
