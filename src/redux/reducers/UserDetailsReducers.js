import * as ActionTypes from '../Action/ActionTypes';

const INITIAL_STATE = {
  isLoading: true,
  errMess: null,
  data: [],
  new: [],
  likeImagesKey: [],
  noOfLikes: -1
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_IMAGES:
      return { ...state, isLoading: false, errMess: null, data: action.payload, noOfLikes: -1 };

    case ActionTypes.IMAGES_LOADING:
      return { ...state, data: [] };

    case ActionTypes.INITIAL_STATE:
      return INITIAL_STATE;

    case ActionTypes.IMAGES_LOADING_FAILED:
      //
      return { ...state, isLoading: false, errMess: action.payload, noOfLikes: -1 };

    case ActionTypes.LIKED_IMAGES_KEY:
      return { ...state, likeImagesKey: action.payload, errMess: 'no', noOfLikes: -1 };

    case ActionTypes.NO_OF_LIKED_IMAGES_FOR_EACH_KEY:
      console.log('sending', action.payload);
      return { ...state, noOfLikes: action.payload, errMess: 'no' };
    default:
      return state;
  }
};
