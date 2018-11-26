import * as ActionTypes from '../Action/ActionTypes';

const INITIAL_STATE = {
  isLoading: true,
  errMess: 'Upload Images',
  data: [],
  new: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_CURRENT_USER_IMAGES:
      console.log('action');
      return { ...state, isLoading: false, errMess: null, data: action.payload };

    case ActionTypes.LOADING_CURRENT_USER_IMAGES:
      return { ...state, data: [] };

    case ActionTypes.NO_CURRENT_USER_DATA_FOUND:
      //  console.log('reducers');
      //   console.log(action.payload);
      // state = INITIAL_STATE;
      //console.log('action');
      return { ...state, data: [], errMess: 'Upload Images', isLoading: false };

    default:
      return state;
  }
};
