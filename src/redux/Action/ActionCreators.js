import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../Url/baseUrl";

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

export const fetchUser = () => ({
  type: ActionTypes.FETCH_IMAGES,
  payload: null
});
