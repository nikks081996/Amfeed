import * as ActionTypes from '../../../constants/ActionTypes';

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

export const noCurrentUserDataFound = () => ({
  type: ActionTypes.NO_CURRENT_USER_DATA_FOUND,
  payload: null
});

export const currentUserLoading = () => ({
  type: ActionTypes.LOADING_CURRENT_USER_IMAGES,
  payload: null
});
