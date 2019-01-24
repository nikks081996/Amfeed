import * as ActionTypes from '../../constants/ActionTypes';

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
