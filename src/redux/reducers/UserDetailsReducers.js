import * as ActionTypes from "../Action/ActionTypes";

const INITIAL_STATE = {
  isLoading: true,
  errMess: null,
  user: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_IMAGES:
      //console.log(action.payload);
      return { ...state, isLoading: false, errMess: null };

    case ActionTypes.IMAGES_ADD:
      return { ...state, user: state.user.concat(action.payload) };
    //return state;

    case ActionTypes.IMAGES_LOADING:
      //  console.log(action.payload);
      return { ...state, isLoading: true, errMess: null, user: [] };

    case ActionTypes.IMAGES_LOADING_FAILED:
      // console.log(action.payload);
      return { ...state, isLoading: false, errMess: action.payload };

    default:
      return state;
  }
};
