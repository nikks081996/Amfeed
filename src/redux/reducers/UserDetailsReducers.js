import * as ActionTypes from '../Action/ActionTypes';

const INITIAL_STATE = {
  isLoading: true,
  errMess: null,
  data: [],
  new: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_IMAGES:
      //  console.log('reducers');
      //   console.log(action.payload);
      // state = INITIAL_STATE;
      //  console.log('action.payload');
      return { ...state, isLoading: false, errMess: null, data: action.payload };

    case ActionTypes.IMAGES_LOADING:
      //  console.log(action.payload);
      return { ...state, data: [] };

    case ActionTypes.INITIAL_STATE:
      return INITIAL_STATE;

    case ActionTypes.IMAGES_LOADING_FAILED:
      // console.log(action.payload);
      return { ...state, isLoading: false, errMess: action.payload };

    default:
      return state;
  }
};
